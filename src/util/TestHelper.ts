/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import TNodeManager from "../node/NodeManager";

import TNode, { INodeConfig } from "../node/Node";
import IMessageBroker, { IMessageBrokerConfig, TMessageBrokerType }
    from "../service/message/MessageBrokerInterface";
import TNodeState, { INodeState } from "../node/NodeState";
import { INodeProps } from "../node/NodeProps";
import { IDBNodeServiceDIConfig } from "../service/db/DBNodeServiceInterface";
import TApplication, { IAppConfig } from "../Application";
import { IAppController } from "../controller/AppController";
import ICallback from "../event/EventCallback";
import * as chai from 'chai';
import * as spies from 'chai-spies';
import { IDBService, IDBListService } from "../service/db/DBService";
import { TAnyObj } from "./Types";
import { IItemTypeEntry } from "../Factory";
import NodeFactory from '../node/NodeFactory';
import * as Debug from "./Debug";
import { getAppConfig } from "./Config";
import { ICommandMessage } from "../schema/schemas";
import INode from "../node/NodeInterface";
import {SubscribeErrorObject} from "../error/ErrorConstants";
import {TWebApiAction, TWebApiResponse} from "../webapi/WebApiTypes";
import {API_MESSAGE} from "../webapi/WebApiConstants";
import {IWebApiMessage} from "../webapi/schema/WebApiMessageSchema";
import EventFactory from "../event/EventFactory";
import * as Event from "../node/NodeEvents";
import TEvent from "../event/Event";

function setupTests(): void {
    // must call .use to attach spies to chai.
    chai.use(spies);

    ["testType", "", "gateway", "root", "node", "test", "weatherStation"].forEach((nodeType) => {
        if (!NodeFactory.isRegisteredType(nodeType)) {
            NodeFactory.register(nodeType, TNode);
        }
    });

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

    Debug.setup(getAppConfig("dev").log);
}

function getCommandTopic(uid: string): string {
    return `device/${uid}/cmd`;
}

function getStatusTopic(uid: string, statusStr = "state"): string {
    return `device/${uid}/status/${statusStr}`;
}

function createMockDBNodeService() {
    return {
        setup(): any {
            return this;
        },

        inject(diConfig: IDBNodeServiceDIConfig): any {
            return this;
        },
        loadState(nodeUID: string): Promise<INodeState> {
            return new Promise(() => { });
        },

        insertState(nodeUID: string, state: INodeState): Promise<void> {
            return new Promise(() => { });
        },

        async loadProps(nodeUID: string): Promise<INodeProps> {
            return {
                uid: nodeUID,
                name: "",
                type: "",
                enabled: true,
                firmwareVersion: "",
                createdAt: 0,
                lastUpdate: 0,
                params: []
            }
        },

        saveProps(props: INodeProps): Promise<object> {
            return new Promise(() => { });
        },

        async loadStates(nodeUID: string, filter: object, limit?: number, skip?: number): Promise<TNodeState[]> {
            return [
                TNodeState.create({
                    timestamp: new Date("2020-04-18").valueOf()
                }),
                TNodeState.create({
                    timestamp: new Date("2020-04-19").valueOf()
                })
            ]
        }
    }
}

function createMockDBListService(): IDBListService {
    return {
        setup(): any {
            return this;
        },

        inject(diConfig: IDBNodeServiceDIConfig): any {
            return this;
        },

        getNodeList(filter: TAnyObj): Promise<INodeProps[]> {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        },
        getNodeProps(uid: string): Promise<INodeProps> {
            return new Promise((resolve, reject) => {
                resolve({
                    uid: "12:23:43:44",
                    type: "wateringstation",
                    enabled: true,
                    name: "watering station",
                    firmwareVersion: "1.0.0",
                    params: [],
                    createdAt: (new Date).valueOf(),
                    lastUpdate: (new Date).valueOf(),
                });
            });
        }
    }
}

function createMockDBService(): IDBService {
    let dbService: IDBService = {
        Connection: <any>{
            connect: (): Promise<any> => { return new Promise((resolve, reject) => { resolve(true); }); },
        },
        Node: createMockDBNodeService(),
        List: createMockDBListService(),
    }

    return dbService;
}

//@TODO: find out how to mock tdevicemanager
function createMockNodeManager(): TNodeManager {
    return new TNodeManager().inject({
        messageBroker: <any>createMockMessageBroker(),
        dbService: createMockDBService(),
        nodeFactory: <any>createMockNodeFactory()
    });
}

function createMockMessageBroker(): IMessageBroker {
    var msgBroker: IMessageBroker = {
        addEventType<EventType extends TEvent>(name: string): IMessageBroker { return msgBroker; },
        addEventTypes(...eventTypeList: string[]): IMessageBroker { return msgBroker; },
        hasEventType(eventType: string): boolean { return true; },
        off(eventType: string, callback: ICallback<TEvent>): IMessageBroker { return msgBroker; },
        trigger(event: TEvent): IMessageBroker { return msgBroker; },
        setup: (config: IMessageBrokerConfig): IMessageBroker => { return msgBroker; },
        connect: (): Promise<any> => { return new Promise((resolve, reject) => { resolve(true); }); },
        end(force?: boolean): Promise<IMessageBroker> {
            return new Promise((resolve) => {
                return {} as IMessageBroker;
            });
        },
        inject: (diConfig: object): IMessageBroker => {
            return msgBroker;
        },
        isConnected: (): boolean => {
            return true;
        },
        on: (name: string, callback: ICallback<TEvent>): IMessageBroker => { return msgBroker; },
        subscribe: (topic: string, callback: Function): Promise<SubscribeErrorObject> => {
            return new Promise((resolve, reject) => {
                return resolve({
                    error: new Error(),
                    topic: "",
                    payload: {}
                });
            });
        },
        subscribeSafe: (topic: string, callback: Function): IMessageBroker => {
            return msgBroker;
        },

        unsubscribe: (): IMessageBroker => { return msgBroker; },
        publish(
            topic: string | string[] | object,
            message: Buffer | string | Object,
            options: TAnyObj
        ) {
            return msgBroker;
        },
        publishCommandToThis(uid: string, command: string, message: ICommandMessage) {
            return msgBroker.publish("testTopic", message,{});
        },
        publishCommandToAll(command: string, message: ICommandMessage) {
            return msgBroker.publish("testTopic", message,{});
        }
    };

    return msgBroker;
}

function createMockAppController(): IAppController {
    return {
        init: () => {
            return this;
        }
    }
}

function createMockNodeList() {

    let device1: INode =
        NodeFactory.createFromData({ props: { name: "weathderStation", type: "weatherStation", uid: "4f:ff:7f:f3" } });
    let device2: INode =
        NodeFactory.createFromData({ props: { name: "weathedrStation", type: "weatherStation", uid: "6f:cb:bc:63" } });
    let device6: INode =
        NodeFactory.createFromData({ props: { name: "weathedrStation", type: "weatherStation", uid: "22:c3:8c:d4" } });

    
    const nodeList = new Map<string, INode>([
        [device1.uid, device1],
        [device2.uid, device2],
        [device6.uid, device6]
    ]);

    return {
        nodeList,
        device1,
        device2,
        device6
    }
}

class TUser {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }
}

interface IMQTTClient {
    subscribe(): this,
    publish(): this,
    on(name: string, callback: Function): this;
}

interface IMQTTEmitter {
    on(name: string, callback: Function);
    removeListener(topic: string, callback: (payload: string) => {});
}

interface IMQTTCallback {
    (payload: string): IMQTTClient
}

function createMockMqttClient(): IMQTTClient {
    return {
        subscribe() { return this; },
        publish() { return this; },
        on(name: string, callback: IMQTTCallback) { return this; }
    }
}

function createMockMqttEmitter(): IMQTTEmitter {
    return {
        on(topic: string, callback: (payload: string) => {}) { },
        removeListener(topic: string, callback: (payload: string) => {}) { }
    }
}

function createMockMongoDBConnection() {
    return {};
}

function createMockMongoDB() {
    return {
        collection(...args): object {
            return this;
        },
        find(...args): object {
            return this;
        },
        findOne(...args): object {
            return this;
        },
        skip(...args): object {
            return this;
        },
        limit(...args): object {
            return this;
        },
        sort(...args): object {
            return this;
        },
        insert(...args): object {
            return this;
        },
        insertOne(...args): object {
            return this;
        },
        update(...args): object {
            return this;
        },
        updateOne(...args): object {
            return this;
        },
        toArray(...args): Promise<any> {
            return new Promise(resolve => { });
        },
        close(): object {
            return this
        },
        db() {
            return {
                // @TODO: put db here
            };
        }
    }
}

function createMockMongoClient() {
    return {
        connect(url, options, callback) {
            callback && callback(undefined, createMockMongoDB());
        }
    };
}



const mockApp = new TApplication();

mockApp.run = async () => {
    return new Promise<any>(
        () => { }
    );
};

function createMockAppConfig(): IAppConfig {
    let config: IAppConfig = {
        extends: undefined,
        log: {
            logdir: "./log",
            name: "test",
            level: 3,
            maxSize: 1048576,
            fileLog: true,
            consoleLog: true,
            consoleLogLevel: 3
        },
        messageBroker: {
            type: TMessageBrokerType.MQTT,
            url: "localhost",
            port: 1883
        },
        db: {
            url: "localhost",
            port: 27017,
            username: "mshs",
            password: "something",
            database: "testdb"
        },
        webApi: {
            port: 8100,
            homeID: "hcs-test"
        }
    };

    return config;
}

function createMockNodeFactory<TItemType>() {
    return {
        _itemTypeList: [],
        createFromData(config: INodeConfig): INode {
            return new TNode(config);
        },
        register(itemType: string, itemClass: { new(...args: any[]): TItemType }): any {
            return this;
        },
        get(itemType: string): IItemTypeEntry<TItemType> {
            return {
                itemType: "TNode",
                itemClass: <any>TNode
            }
        },
        getRegisteredItems(): string[] {
            return ["node"];
        },
        create(itemType: string, ...args: any[]) {
            return {};
        },
        isRegisteredType(itemType: string) {
            return true;
        }
    }
}

function createMockWebApi() {
    return {
        run(): void {},
        addAction(actionName: string, action: TWebApiAction): TWebApiResponse {},
        addDevice(node: INode) {},
        removeDevice(node: INode) {},
        broadcastAppStart() {},
        broadcastAppStop() {},
        broadcastMessage(messageName: API_MESSAGE, message: IWebApiMessage) {},
        stop() {}
    }
}

export {
    setupTests,
    TUser,
    TEvent as TEvent,
    getCommandTopic,
    getStatusTopic,
    createMockDBNodeService,
    createMockNodeManager,
    createMockMessageBroker,
    createMockNodeList,
    createMockAppController,
    createMockMqttClient,
    createMockMqttEmitter,
    createMockMongoDBConnection,
    createMockMongoClient,
    createMockDBService,
    createMockAppConfig,
    createMockNodeFactory,
    createMockWebApi,
    mockApp
}