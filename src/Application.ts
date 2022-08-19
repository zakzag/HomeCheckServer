/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import TNodeManager from "./node/NodeManager";
import IMessageBroker from "./service/message/MessageBrokerInterface";
import { TObservable, TInjectable } from "./mixin/mixins";
import { IAppController } from "./controller/AppController";
import { IDBService } from "./service/db/DBService";
import { IMessageBrokerConfig } from "./service/message/MessageBrokerInterface";
import { IDBConnectionConfig } from "./service/db/DBConnectionInterface";
import * as Debug from "./util/Debug";
import { TNodeFactory } from "./node/NodeFactory";
import { TEventFactory } from "./event/EventFactory";
import {IWebApi, IWebApiConfig} from "./webapi/WebApiInterface";
import Color from "./util/Colors";
import {IWebClientConfig} from "./mock/client/WebClient";

class TBaseApplication { }

export interface IAppConfig {
    extends: string;
    log: Debug.IDebugConfig;
    messageBroker: IMessageBrokerConfig;
    db: IDBConnectionConfig;
    webApi: IWebApiConfig;
    client?: IWebClientConfig;
}

interface IAppDIConfig {
    config: IAppConfig;
    nodeManager: TNodeManager;
    messageBroker: IMessageBroker;
    dbService: IDBService;
    appController: IAppController;
    nodeFactory: TNodeFactory;
    eventFactory: TEventFactory;
    webApi: IWebApi;
}

interface IApplication {
    config: IAppConfig;
    nodeManager: TNodeManager;
    messageBroker: IMessageBroker;
    dbService: IDBService;
    appController: IAppController;
    webApi: IWebApi;
    homeID: string;
    run(): void;

}

class TApplication extends TInjectable(TObservable(TBaseApplication)) implements IApplication {
    private _config: IAppConfig;
    private _nodeManager: TNodeManager;
    private _messageBroker: IMessageBroker;
    private _dbService: IDBService;
    private _appController: IAppController;
    private _webApi: IWebApi;
    private _homeID: string;

    async run() {
        try {
            Debug.info("Starting Homecheck server...");

            this.messageBroker
                .setup(this.config.messageBroker);

            Debug.info("Connection to MQTT...");
            
            await this.messageBroker.connect().catch((e) => {
                Debug.hcError(e);
                process.exit(1);
            });

            Debug.info(`MQTT connection has been established on port `+
                `${Color.FgYellow}#${this.config.messageBroker.port}${Color.Reset}`);

            await this.dbService.Connection.connect(this.config.db).catch(e => {
                Debug.hcError(e);
                process.exit(2);
            });

            Debug.info("MongoDB: connection has been established");

            // this will setup Node and List services, so it sets default dependencies
            this.dbService.Node.setup();
            this.dbService.List.setup();

            this._homeID = this.config.db.database;

            Debug.info(`Starting WebAPI without authentication...`);
            this.webApi.run();
            Debug.info(`WebAPI started and listening on port` +
                `${Color.FgYellow}#${this.config.webApi.port}${Color.Reset}`);

            await this.appController.init(this.homeID);
            Debug.info(`Application is up and listening to home: "${Color.FgCyan}${this.homeID}${Color.Reset}"`);
        } catch (e) {
            Debug.error(e);
        }
    }

    get nodeManager(): TNodeManager {
        return this._nodeManager;
    }

    get messageBroker(): IMessageBroker {
        return this._messageBroker;
    }

    get appController(): IAppController {
        return this._appController;
    }

    get config(): IAppConfig {
        return this._config;
    }

    get dbService(): IDBService {
        return this._dbService;
    }

    get webApi(): IWebApi {
        return this._webApi;
    }

    get homeID(): string {
        return this._homeID;
    }
}

let app = new TApplication();

export default TApplication;
export {
    IApplication,
    IAppDIConfig,
    app as Application
}