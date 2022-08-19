/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { TAnyObj } from "../../util/Types";
import { IObservable } from "../../mixin/Observable";
import { IInjectable } from "../../mixin/Injectable";
import { IMessage, ICommandMessage } from "../../schema/schemas";
import {SubscribeErrorObject} from "../../error/ErrorConstants";

enum TMessageBrokerType { 
    MQTT = "MQTT" 
}
/**
 * Callback function for event broker
 */
interface IBrokerCallback {
    (message: IMessage, topic: string): void;
}

interface IMessageBrokerConfig {
    type: TMessageBrokerType,
    url: string,
    port: number,
    username?: string,
    password?: string,
    clientId?: string,
    rootTopic?: string,
    commandTopicName?: string,
    statusTopicName?: string
}

interface IMessageBroker extends IObservable, IInjectable {
    /**
     * Setup broker before first use. 
     * @param config  Essential data for the broker (Server connection, homeID)
     */
    setup(config: IMessageBrokerConfig): this;

    /**
     * Connects to the message server
     */
    connect(): Promise<any>;
    /**
     * Ends connection with message server
     * 
     * @param force  if true, it quits anyway
     */
    end(force?: boolean): Promise<this>;

    /**
     * True if broker is already connected
     */
    isConnected(): boolean;
    /**
     * Subscribes to a message topic, and when message arrives, calls callback.
     * This is a general method for specific subscribe methods, dont use it only if
     * really needed
     * 
     * @param topic     Topic string
     * @param callback  Method that will be called on message arrive
     */
    subscribe(topic: string, callback: IBrokerCallback): Promise<SubscribeErrorObject>;

    /**
     * Same as subscribe, but error handling is included. It will use internal Debug object
     * @param {string} topic
     * @param {IBrokerCallback} callback
     * @returns {this}
     */
    subscribeSafe(topic: string, callback: IBrokerCallback): this;
    unsubscribe(topic: string, callback: IBrokerCallback): this;
    publish(
        topic: string | string[] | object,
        message: Buffer | string | Object,
        options?: TAnyObj
    ): this;
    /**
     * Specialisation of publish method. This will publish one command to a particular device defined
     * by its uid.
     * @param uid      Device UID to send command to
     * @param command  Command string (enum, @see MSG_CMD)
     * @param message  Message body, must be an object with meta and data tags
     */
    publishCommandToThis(uid: string, command: string, message: ICommandMessage): this;

    /**
     * Specialisation of publish method. This will publish one command to all devices (go-sleep for example)
     * 
     * @param command  Command string (enum, @see MSG_CMD)
     * @param message  Message body, must be an object with meta and data tags
     */
    publishCommandToAll(command: string, message: ICommandMessage): this;
}

export default IMessageBroker;
export {
    IBrokerCallback,
    TMessageBrokerType,
    IMessageBroker,
    IMessageBrokerConfig
}