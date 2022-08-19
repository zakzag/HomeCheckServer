/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import TInjectable from "../mixin/Injectable";
import IMessageBroker from "../service/message/MessageBrokerInterface";
import * as MC from "../message/MessageConstants";
import {IDBService} from "../service/db/DBService";
import TNodeManager from "../node/NodeManager";
import {commandToAllDevices, commandToDevice, allInfoStatus} from '../message/TopicHelper';
import TDeviceNode from '../device/DeviceNode';
import {MSG_CMD as CMD} from "../message/MessageConstants";
import * as Debug from "../util/Debug";
import HCError from "../error/HCError";
import {IResponseMessage} from "../schema/schemas";
import {composeCommandMessage} from "../message/MessageComposer";
import {IWebApi} from "../webapi/WebApiInterface";

class TBaseAppController {
}

interface IAppController {
    init(homeID: string): Promise<any>;
}

interface IAppControllerDIConfig {
    messageBroker: IMessageBroker;
    nodeManager: TNodeManager;
    dbService: IDBService;
    webApi: IWebApi;
}

/**
 * This is the real application, not the application class!
 */
class TAppController extends TInjectable(TBaseAppController) implements IAppController {
    private _messageBroker: IMessageBroker;

    get messageBroker(): IMessageBroker {
        return this._messageBroker;
    }

    private _dbService: IDBService;

    get dbService(): IDBService {
        return this._dbService;
    }

    private _nodeManager: TNodeManager;

    get nodeManager(): TNodeManager {
        return this._nodeManager;
    }

    private _webApi: IWebApi;

    get webApi(): IWebApi {
        return this._webApi;
    }

    private _homeID: string;

    get homeID(): string {
        return this._homeID;
    }

    /**
     * Initializes application:
     * * Builds device tree from database
     * * Sends GET_ALL_DEVICE_INFO to all the devices
     * * Binds all event handlers needed
     * * Sets homeID
     */
    public async init(homeID: string): Promise<any> {
        this._homeID = homeID;

        try {
            await this.buildDeviceList();
            this.sendGetDeviceListCommand();
            this.subscribeEvents();

        } catch (e) {
            if (e instanceof HCError) {
                Debug.hcError(e);
            } else {
                Debug.error(e);
            }
        }
    }

    /**
     * This initializes Node manager to
     * @TODO: do I need to implement buildListfromDB() elsewhere?
     */
    private async buildDeviceList(): Promise<any> {
        await this.nodeManager.buildListFromDB();

        /* add all devices to the webapi so it will trigger and send notifications via websocket to the client */
        this.nodeManager.nodeList.forEach((node) => {
            this.webApi.addDevice(node);
        })
    }

    private sendGetDeviceListCommand(): IMessageBroker {
        // sending "get-info" message to all devices, it will help 
        // build up and update node list in Node Manager.
        // It sends an empty message. The message itself invokes a request

        return this.messageBroker.publish(
            commandToAllDevices(MC.MSG_CMD.GET_INFO),                      // topic
            composeCommandMessage("get-info", {})           // no params
        );
    }

    private subscribeEvents() {
        /* these events are handled by Application, because:
           if a device was sleeping during server start, it did not get "get-info" message
           so server does not know anything about the device. If it's a new one, then server
           does not know about its existence, so there's no any Node created for it by
           Node Manager. Subscribing to "get-info" event makes the server know about new devices
           and create a device for each of them in database */

        this.messageBroker
            .subscribeSafe(allInfoStatus(), this.onGetInfo.bind(this));
    }

    private async onGetInfo(message: IResponseMessage) {
        try {
            let device: TDeviceNode = this.nodeManager.findNode<TDeviceNode>(message.meta.uid);

            Debug.detail(`DEVICE INFO RECEIVED: ${message.meta.uid}`);

            if (device) {
                Debug.detail(`Device found in list: ${message.meta.uid}, updating properties...`);
            } else {
                Debug.detail(`NEW Device found: ${message.meta.uid}`);

                try {
                    await this.nodeManager.createNewNode(message.meta, message.data);
                } catch(e) {
                    Debug.error(`10001 Error : ${e.key} ${e.message}`);
                }
            }
        } catch (e) {
            Debug.error("Invalid INFO message received. Message was dropped.");
            Debug.detail(`Message: ${message}`);
        }
        try {
            Debug.detail("Sending Command:", commandToDevice(message.meta.uid, CMD.GET_STATE));

            this.messageBroker.publish(
                commandToDevice(message.meta.uid, CMD.GET_STATE),
                composeCommandMessage("get-state", {

                })
            );
        } catch(e) {
            Debug.error("Error during creating new device: ", e.message);
        }
    }
}

export default TAppController;

export {
    IAppController,
    IAppControllerDIConfig
}