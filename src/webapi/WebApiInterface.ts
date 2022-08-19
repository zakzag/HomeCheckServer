/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import INode from "../node/NodeInterface";
import TNodeManager from "../node/NodeManager";
import {IWebApiMessage} from "./schema/WebApiMessageSchema";
import {API_MESSAGE} from "./WebApiConstants";
import {Server} from "socket.io";

interface IWebApi {
    /**
     * Starts the API by
     */
    run(): void;

    /**
     * Adds a node to WebApi to listen to
     * Once added, webapi broadcast a message on each event related to node
     *
     * @param {INode} node
     */
    addDevice(node: INode);

    /**
     * Removes all listener connected to the provided node
     * WebApi will not listen to events and changes on the provided node
     *
     * @param {INode} node
     */
    removeDevice(node: INode);

    /**
     * Sends a message to all client about application launch
     */
    broadcastAppStart();

    /**
     * Sends a message to all client about application stop
     */
    broadcastAppStop();

    /**
     * Send an event of type defined by messageName to all connected clients
     *
     * @param messageName   Type of the message
     * @param message       Message Body as object
     */
    broadcastMessage(messageName: API_MESSAGE, message?: IWebApiMessage)

    /**
     * Stops WebApi, closes the steam channel and
     * all open connection to all clients
     */
    stop();
}

interface IWebApiConfig {
    port: number;
    homeID: string;

}

interface IWebApiDIConfig {
    server: Server,
    nodeManager: TNodeManager // @TODO: create NodeManager interface
    // UIManager:
}

export {
    IWebApi,
    IWebApiConfig,
    IWebApiDIConfig
}