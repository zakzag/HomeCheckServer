/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {Application, IAppConfig, IAppDIConfig} from "../Application";
import TAppController, {IAppController} from "../controller/AppController";
import TMQTTBroker from "../service/message/MQTTBroker";
import TNodeManager from "../node/NodeManager";
import DBService, {IDBService} from "../service/db/DBService";
import IMessageBroker from "../service/message/MessageBrokerInterface";
import NodeFactory from "../node/NodeFactory";
import EventFactory from "../event/EventFactory";
import * as Debug from "./Debug";
import TWeatherStationDevice from "../device/WeatherStation/WeatherStationDevice";
import TWateringStationDevice from "../device/WateringStation/WateringStationDevice";
import * as chai from 'chai';
import * as spies from 'chai-spies';
import {expect} from 'chai';
import TWebApi from "../webapi/WebApi";
import * as Event from "../node/NodeEvents";
import {IWebApi, IWebApiDIConfig} from "../webapi/WebApiInterface";
import {Server} from "socket.io";

/** diConfig is the Dependency Injection object for the application having all
 *  the references needed for the application to run*/
let diConfig: IAppDIConfig;

/** Application Configuration object with data for log,db,messagebroker  */
let appConfig: IAppConfig;

/**
 * This needs to be executed once, before all test runner
 */
function initIntegrationTests() {
    chai.use(spies);
}

/**
 * Initializes a test run (before each 'it') by
 * - reading app config
 * - resetting singletons like NodeFactory, EventFactory
 * - creating all dependencies
 * - and composing a diConfig object
 *
 * @param {IAppConfig} appCfg
 * @returns {Promise<IAppDIConfig>}
 */
async function createDependencies(appCfg: IAppConfig): Promise<IAppDIConfig> {
    appConfig = appCfg;
    appCfg.log.consoleLogLevel = 3;

    Debug.log("Creating dependencies...");

    NodeFactory.empty();
    NodeFactory.register("weatherstation", TWeatherStationDevice);
    NodeFactory.register("wateringstation", TWateringStationDevice);

    EventFactory.empty();
    EventFactory.register(Event.TNodeAttachEvent);
    EventFactory.register(Event.TNodeFailureEvent);
    EventFactory.register(Event.TNodeInfoReceiveEvent);
    EventFactory.register(Event.TNodeListUpdateEvent);
    EventFactory.register(Event.TNodeParamsChangeEvent);
    EventFactory.register(Event.TNodePropsChangeEvent);
    EventFactory.register(Event.TNodeRemoveEvent);
    EventFactory.register(Event.TNodeStateChangeEvent);
    EventFactory.register(Event.TNodeStateReceiveEvent);

    const messageBroker: IMessageBroker = new TMQTTBroker();

    const nodeManager: TNodeManager = (new TNodeManager()).inject({
        messageBroker,
        dbService: DBService,
        nodeFactory: NodeFactory
    });

    const { port: webApiPort, homeID } = appConfig.webApi;
    const socketIoServer = new Server(webApiPort, {
        path: `/${homeID}/`
    });

    const webApiDIConfig: IWebApiDIConfig = {
        server: socketIoServer,
        nodeManager
    };

    const webApi: IWebApi = (new TWebApi()).inject(webApiDIConfig);

    const appController: IAppController = new TAppController().inject({
        messageBroker,
        nodeManager,
        dbService: DBService,
        webApi
    });

    diConfig = {
        config: appConfig,
        nodeManager: nodeManager,
        messageBroker,
        appController,
        dbService: DBService,
        nodeFactory: NodeFactory,
        eventFactory: EventFactory,
        webApi
    }

    Debug.info("Creating dependencies... Done.");

    return diConfig;
}

async function initTest(diConfig: IAppDIConfig, appConfig: IAppConfig) {
    mockMessageBroker(diConfig.messageBroker);
    await initDb(diConfig.dbService, appConfig.db);
    await createDevices(diConfig.nodeManager);
    await runApplication(diConfig);
}

/**
 * It starts the application object and sets its dependencies
 *
 * @param {IAppDIConfig} diConfig
 * @returns {Promise<void>}
 */
async function runApplication(diConfig: IAppDIConfig) {
    Debug.log("Trying to create application...")
    Application.inject(diConfig);
    await Application.run();

    setDIConfig(diConfig);
    Debug.info("Creating application...Done.");
}

/**
 * Sets the common reference to diConfig object, it is used by many functions
 *
 * @param diCfg
 */
function setDIConfig(diCfg) {
    diConfig = diCfg;
}

function printSeparator() {
    Debug.info(".".repeat(60));
}


/**
 * Initializes Database Service object using dbConfig by connection to the
 * database and removes each tables from it, and created an empty nodeList table
 *
 * @param {IDBService} dbService
 * @param dbConfig
 * @returns {Promise<void>}
 */
async function initDb(dbService: IDBService, dbConfig) {
    Debug.log("Init db...");
    await dbService.Connection.connect(dbConfig);

    Debug.detail(`using database ${appConfig.db.database}`);
    Debug.info("Emptying database...");

    if (await dbService.Connection.checkIfDatabaseExists(appConfig.db.database)) {
        const tables = await dbService.Connection.getTableList();

        for (let i = 0; i < tables.length; i++) {
            let table = tables[i];
            Debug.detail(`Dropping table "${table}"`);
            await dbService.Connection.dropTable(table);
        }
    }

    Debug.log("Creating collection nodeList...")
    await dbService.Connection.createTable("nodeList");

    Debug.info("Init db... done");
}

async function createDevices(nodeManager: TNodeManager) {

    /*const message: IResponseMessage = {
        meta: {
            requestId: "none",
            uid: "11:11:11:11"
        },
        data: {
            status: {
                errorCode:
            }
        }
    }

    await this.nodeManager.createNewNode(message.meta, message.data);*/
}

/**
 * Waits msec milliseconds when asynchronously called (using await)
 * @param msec
 * @returns {Promise<any>}
 */
async function wait(msec: number): Promise<any> {
    return new Promise((resolve)=>{
        setTimeout(() => {
            return resolve(true);
        }, msec);
    });
}

/**
 * It makes a mock message broker from the existing one by mocking
 * subscribe and publish methods, but it leaves the original behavior as it was
 *
 * @param {IMessageBroker} messageBroker
 */
function mockMessageBroker(messageBroker: IMessageBroker) {
    chai.spy.on(messageBroker, ["subscribe"], messageBroker.subscribe);
    chai.spy.on(messageBroker, ["publish"], messageBroker.publish);
    expect(messageBroker.subscribe).to.be.spy;
    expect(messageBroker.publish).to.be.spy;
}

function getTableName(prefix: string, uid: string) {
    return `${prefix}${uid.substr(0, 2)}${uid.substr(3, 2)}${uid.substr(6, 2)}${uid.substr(9, 2)}`;
}

export {
    initIntegrationTests,
    createDependencies,
    initDb,
    initTest,
    createDevices,
    runApplication,
    wait,
    mockMessageBroker,
    printSeparator,
    getTableName,
}