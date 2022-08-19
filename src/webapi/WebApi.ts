/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {TInjectable, TObservable} from "../mixin/mixins";
import {IWebApi} from "./WebApiInterface";
import {IDeviceNode} from "../device/DeviceNodeInterface";
import {Server, Socket} from "socket.io";
import {EVENT} from "../event/EventConstants";
import * as Debug from "../util/Debug";
import TNodeManager from "../node/NodeManager";
import {TWebActionList, TWebApiAction, TWebApiResponse} from "./WebApiTypes";
import {DevelopmentError} from "../error/ErrorConstants";
import GetDeviceAction from "./action/GetDeviceAction";
import {API_MESSAGE, API_NODE_ACTION} from "./WebApiConstants";
import {
    TNodeAttachEvent, TNodeFailureEvent, TNodeListUpdateEvent, TNodeParamsChangeEvent,
    TNodePropsChangeEvent, TNodeRemoveEvent, TNodeStateChangeEvent
} from "../node/NodeEvents";
import {composeWebApiStatusMessage} from "./WebApiMessageComposer";
import {IWebApiMessage} from "./schema/WebApiMessageSchema";

class TBaseWebApi { }

/**
 * TWebApi is the Interface between the Server and the Clients. It uses WebSocket to
 * connect to the server, and creates a permanent connection while communicating.
 * For very basic safety, it uses homeID as path, so the client should know what
 * Home ID and Port to use. ws://url:<port>/<homeID>/
 *
 * WebApi has Actions. All actions is a function that is executed when a particular
 * message is sent to the WebApi from clients. It's like a response to a request.
 * For Now all the actions are organized in separate files as methods
 * When a message is received from any client
 */
class TWebApi extends TInjectable(TObservable(TBaseWebApi)) implements IWebApi {
    /** @field _server  Reference to the underlying socket.io server */
    private _server: Server;
    get server(): Server {
        return this._server;
    }

    /** @field _nodeManager  Reference to NodeManager */
    private _nodeManager: TNodeManager;
    get nodeManager(): TNodeManager {
        return this._nodeManager;
    }

    /** @field _UIManager */
    /* private _UIManager */
    /* get UIManager(): TUIManager { return this._UIManager; } */

    /** @field _actions  List of actions in a key-value map, describing what action needs to be executed when
     *                   a particular message was sent to WebApi */
    private _actions: TWebActionList = new Map<string, TWebApiAction>();
    private get actions(): TWebActionList {
        return this._actions;
    }

    private _isRunning: boolean = false;
    private get isRunning(): boolean {
        return this._isRunning;
    }
    private set isRunning(value: boolean) {
        this._isRunning = value;
    }

    /**
     * call this method to start WebApi
     * It initializes the underlying socket.io server
     * subscribes to events on NodeManager and UIManager
     * subscribes to connect event which is the initializer for each client
     * triggers a SERVER_START event
     */
    run() {
        if (this.isRunning) {
            Debug.warn("WebApi is already running");
            return;
        }

        this.addAction(API_MESSAGE.GET_DEVICE, GetDeviceAction);
        // actions:
        // - GET_ROOM_INFO: room name, device ids(?)
        // - GET_ROOM_

        /* removed from constructor because nodeManager does not exist when constructor is being called
           so the next event is calling run method */
        this.nodeManager.on(EVENT.NODE_ATTACH, this.onNodeAttach.bind(this));
        this.nodeManager.on(EVENT.NODE_REMOVE, this.onNodeRemove.bind(this));
        this.nodeManager.on(EVENT.NODELIST_UPDATE, this.onNodeListUpdate.bind(this));

        /* event handler when a client connects to the server */
        this.server.on("connection", this.onClientConnect.bind(this));
        /* don't look for it: there's no disconnect event */

        // send broadcast message to all already connected clients
        this.broadcastAppStart();

        this.isRunning = true;
    }

    /**
     * Adds a new action to the WebApi
     *
     * @param {string} actionName
     * @param {TWebApiAction} action
     */
    private addAction(actionName: string, action: TWebApiAction) {
        if (this.actions.has(actionName)) {
            throw new DevelopmentError(`Action: "${actionName}" is already registered`);
        }

        this.actions.set(actionName, action);
    }

    addDevice(node: IDeviceNode) {
        Debug.detail(`Adding device to pool: #${node.name}@${node.uid}`);
        node.on(EVENT.NODE_FAILURE, this.onNodeFailure.bind(this));
        node.on(EVENT.NODE_ERROR, this.onNodeError.bind(this));
        node.on(EVENT.NODE_PARAMS_UPDATE, this.onNodeParamsUpdate.bind(this));
        node.on(EVENT.NODE_PROPS_UPDATE, this.onNodePropsUpdate.bind(this));
        node.on(EVENT.NODE_STATE_UPDATE, this.onNodeStateUpdate.bind(this));
    }

    removeDevice(node: IDeviceNode) {
        node.off(EVENT.NODE_FAILURE, this.onNodeFailure.bind(this));
        node.off(EVENT.NODE_ERROR, this.onNodeError.bind(this));
        node.off(EVENT.NODE_PARAMS_UPDATE, this.onNodeParamsUpdate.bind(this));
        node.off(EVENT.NODE_PROPS_UPDATE, this.onNodePropsUpdate.bind(this));
        node.off(EVENT.NODE_STATE_UPDATE, this.onNodeStateUpdate.bind(this));
    }

    public broadcastAppStart() {
        this.broadcastMessage(API_MESSAGE.SERVER_START);
    }

    public broadcastAppStop() {
        this.broadcastMessage(API_MESSAGE.SERVER_STOP);
    }

    public broadcastMessage(messageName: API_MESSAGE, message?: IWebApiMessage) {
        if (!message) {
            this.server.emit(messageName, {});
        } else {
            this.server.emit(messageName, JSON.stringify(message));
        }

    }

    public stop() {
        Debug.info("WebApi was closed forcefully");

        this.broadcastAppStop();
        this.server.close();
        this.server.disconnectSockets(true);

        this.isRunning = false;
    }

    /**
     * This method is only for logging connect event of a client. Once a client is connected it will trigger
     * client-connect event which does the job.
     *
     * @param {Socket} socket
     */
    protected onClientConnect(socket: Socket) {
        Debug.info("Clients connected: ", socket.id);

        this.bindActionsToClient(socket);

        // debug only: prints client socket ids
        this.server.sockets.sockets.forEach((oneSocket) => {
            Debug.detail(`SOCKET:${oneSocket.id}`);
        });

        // subscribe to all commands from client, and implement responses
        // socket.on(API_EVENT.)
        this.actions.forEach((action, key) => {
            Debug.detail(`Action ' ${key}'added on client connect`);
            this.server.on(key, action);
        });
    }

    protected bindActionsToClient(socket: Socket) {
        this.actions.forEach((action, actionName) => {
            Debug.detail(`Add action ${actionName} to client`);

            socket.on(actionName, (...data) => {
                const result: TWebApiResponse = action.call(this, ...data);
                socket.emit(`${actionName}-response`, result);
            });
        });
    }

    protected onNodeAttach(event: TNodeAttachEvent) {

        const msg: IWebApiMessage = composeWebApiStatusMessage(event.requestId, event.uid, {
            nodeAction: API_NODE_ACTION.ADD
        });


        this.broadcastMessage(API_MESSAGE.NODE_ATTACH, msg);

        const node: IDeviceNode = this.nodeManager.findNode(event.uid);

        if (node) {
            this.addDevice(node);
        } else {
            Debug.warn(`Device #${event.uid} was created and added to device list but not found`);
        }
        Debug.log(`onNodeAttach:  ${event.uid}`);
    }

    protected onNodeRemove(event: TNodeRemoveEvent) {
        const msg = composeWebApiStatusMessage(event.requestId, event.uid, {
            nodeAction: API_NODE_ACTION.REMOVE
        });

        this.broadcastMessage(API_MESSAGE.NODE_REMOVE, msg);

        const node: IDeviceNode = this.nodeManager.findNode(event.uid);
        if (node) {
            this.removeDevice(node)
        } else {
            Debug.warn(`Device #${event.uid} was removed and not found in device list`);
        }
        Debug.detail("onNodeRemove: ", event.uid);
    }

    protected onNodeListUpdate(event: TNodeListUpdateEvent) {
        const msg = composeWebApiStatusMessage(event.requestId, event.uid, {
            nodeAction: API_NODE_ACTION.NODELIST_UPDATE
        });

        this.broadcastMessage(API_MESSAGE.NODELIST_UPDATE, msg);
    }

    protected onNodeFailure(event: TNodeFailureEvent) {
        //this.broadcastMessage(event.requestId, event.data);
        Debug.detail("onNodeFailure: ", event.data);
        const msg = composeWebApiStatusMessage(event.requestId, event.uid, {
            status: event.data.state
        });

        this.broadcastMessage(API_MESSAGE.NODE_FAILURE, msg);
    }

    protected onNodeError(event: TNodeFailureEvent) {
        //this.broadcastMessage(event.requestId, event.data);
        Debug.detail("onNodeError: ", event.data);
        const msg = composeWebApiStatusMessage(event.requestId, event.uid, {
            status: event.data.state
        });

        this.broadcastMessage(API_MESSAGE.NODE_ERROR, msg);
    }

    protected onNodeParamsUpdate(event: TNodeParamsChangeEvent) {
        const msg = composeWebApiStatusMessage(event.requestId, event.uid, {
            nodeAction: API_NODE_ACTION.UPDATE,
            params: event.data.prevParams
        });

        this.broadcastMessage(API_MESSAGE.NODE_PARAMS_UPDATE, msg);
        Debug.detail("onNodeParamsUpdate: ", event.data);
    }

    protected onNodePropsUpdate(event: TNodePropsChangeEvent) {
        const msg = composeWebApiStatusMessage(event.requestId, event.uid, {
            props: event.data.props
        });

        this.broadcastMessage(API_MESSAGE.NODE_PROPS_UPDATE, msg);
        Debug.detail("onNodePropsUpdate: ", event.data);
    }

    protected onNodeStateUpdate(event: TNodeStateChangeEvent) {
        Debug.detail("onNodeStateUpdate", event.data);
        const msg = composeWebApiStatusMessage(event.requestId, event.uid, {
            status: event.data.state
        });

        this.broadcastMessage(API_MESSAGE.NODE_STATE_UPDATE, msg);
    }
}

export default TWebApi;