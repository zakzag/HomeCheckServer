/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

/* 
   create a global app object
   - message adapter instance
   - nodemanager instance
   - observable interface
   create MQTT message adapter, inject into global app
   create node manager, inject into global app
   run application
*/
import { Application, IAppConfig, IAppDIConfig } from "./Application";
import TAppController from "./controller/AppController";
import EventFactory from "./event/EventFactory";
import NodeFactory from "./node/NodeFactory";
import TNodeManager from "./node/NodeManager";
import DBService from "./service/db/DBService";
import TMQTTBroker from "./service/message/MQTTBroker";
import IMessageBroker from "./service/message/MessageBrokerInterface";
import { getAppConfig } from "./util/Config";

/* node types installed */
import TWeatherStationDevice from './device/WeatherStation/WeatherStationDevice';
import TWateringStationDevice from './device/WateringStation/WateringStationDevice';
import * as Debug from "./util/Debug";
import * as Log from "./util/Debug";
import {IWebApi, IWebApiDIConfig} from "./webapi/WebApiInterface";
import TWebApi from "./webapi/WebApi";
import * as Event from "./node/NodeEvents";
import TNuclearRadiationDetectorDevice from "./device/NuclearRadiationDetector/NuclearRadiationDetector";
import {Server} from "socket.io";

{
    let appConfig: IAppConfig = getAppConfig();
    Log.setup(appConfig.log);
    /*
     * Register installed node types 
     * @TODO: make it automatic using require and fs object (read all directories from node
     *        and add all node types to NodeFactory);
     */
    Debug.info(""); // line feed
    NodeFactory.register("weatherstation", TWeatherStationDevice);
    NodeFactory.register("wateringstation", TWateringStationDevice);
    NodeFactory.register("nuclear-radiation-detector", TNuclearRadiationDetectorDevice);
    Debug.info(""); // line feed

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

    const webApiCfg = appConfig.webApi;
    const socketIoServer = new Server(webApiCfg.port, {
        path: `/${webApiCfg.homeID}/`
    });

    const webApiDIConfig: IWebApiDIConfig = {
        server: socketIoServer,
        nodeManager
    };

    const webApi: IWebApi = (new TWebApi()).inject(webApiDIConfig);

    const appController = new TAppController().inject({
        messageBroker,
        nodeManager,
        dbService: DBService,
        webApi
    });

    const appDIConfig: IAppDIConfig = {
        config: appConfig,
        nodeManager,
        messageBroker,
        appController,
        dbService: DBService,
        nodeFactory: NodeFactory,
        eventFactory: EventFactory,
        webApi
    };

    Application.inject(appDIConfig);

    Application.run();
}