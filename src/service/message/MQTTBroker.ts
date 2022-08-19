/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import IMessageBroker, { IMessageBrokerConfig, IBrokerCallback } from "./MessageBrokerInterface";
import * as MQTTEmitter from "mqtt-emitter";
import { TObservable, TInjectable } from "../../mixin/mixins";
import * as mqtt from "mqtt";
import { TAnyObj } from "../../util/Types";
import { IClientPublishOptions } from "mqtt";
import { getFullTopic } from "../../message/TopicHelper";
import * as Debug from "../../util/Debug";
import process from '../../message/MessageProcessor';
import {IMessage, ICommandMessage, CommandMessageSchema} from "../../schema/schemas";
import { TMessagePayload } from "../../message/MessageTypes";
import * as Topic from "../../message/TopicHelper";
import {EVENT, MQTT_EVENT} from "./MQTTConstants";
import Color from "../../util/Colors";
import {TBrokerErrorEvent} from "./event/BrokerErrorEvent";
import {TBrokerConnectedEvent} from "./event/BrokerConnectEvent";
import {TBrokerOfflineEvent} from "./event/BrokerOfflineEvent";
import {TBrokerEndEvent} from "./event/BrokerEndEvent";
import {IClientOptions} from "mqtt/types/lib/client";
import {SubscribeErrorObject} from "../../error/ErrorConstants";

class TBaseMQTTBroker { }


interface IMQTTBrokerDIConfig {
    process: (payload: TMessagePayload, topic: string, converter: Function, normalizer: Function) => IMessage;
}

class TMQTTBroker extends TInjectable(TObservable(TBaseMQTTBroker)) implements IMessageBroker {
    private _config: IMessageBrokerConfig;
    private _client: mqtt.Client;
    private readonly _process: Function; // @TODO: fix it using specific function
    private readonly _emitter: TAnyObj;
    private _homeID: string;

    /**
     * Constructor of the MQTT Broker, when config.param is not defined, then the default
     * processor will be used. It is the processor for HCS server
     * @param config 
     */
    constructor(config: IMQTTBrokerDIConfig = { process }) {
        super();

        this._emitter = new MQTTEmitter();
        this._process = config.process;
        this.addEventTypes(EVENT.BROKER_CONNECT, EVENT.BROKER_ERROR, EVENT.BROKER_OFFLINE, EVENT.BROKER_END);
    }

    public get config(): IMessageBrokerConfig {
        return this._config;
    }

    public get client(): mqtt.Client {
        return this._client;
    }


    public get emitter(): TAnyObj {
        return this._emitter;
    }

    public get homeID(): string {
        return this._homeID;
    }

    public setup(config: IMessageBrokerConfig): this {
        this._config = config;
        this._homeID = config.rootTopic;

        return this;
    }

    public connect(): Promise<any> {
        return new Promise((resolve, reject) => {
            const fullUrl: string = `mqtt://${this._config.url}:${this._config.port}`;

            const options: IClientOptions = {
                clean: false,
                clientId: this._config.clientId,
                protocolId: "MQIsdp",
                protocolVersion: 3,
                connectTimeout: 5000,
            }

            Debug.detail(`Host: ${this._config.url}:${this._config.port}`);

            if (this._config.username && this._config.password) {
                Debug.detail(`MQTT user/password provided, using authentication for login`);
                Debug.detail(`User: ${this._config.username}, password:${this._config.password}`);
                options.username = this._config.username;
                options.password = this._config.password;
            }

            this._client = mqtt.connect(fullUrl, options);

            this.client.on(MQTT_EVENT.CONNECT, resolve);
            this.client.on(MQTT_EVENT.CONNECT, this.onConnected.bind(this));
            this.client.on(MQTT_EVENT.MESSAGE, this.onMessage.bind(this));
            this.client.on(MQTT_EVENT.ERROR, (e) => {
                this.onError.call(this, e);
                reject(e);
            });
            this.client.on(MQTT_EVENT.END, this.onEnd.bind(this));
            this.client.on(MQTT_EVENT.OFFLINE, this.onOffline.bind(this));

            this.emitter.onadd = (topic: string): void => {
                this.client.subscribe(topic);
            }

            this.emitter.onremove = (topic: string): void => {
                this.client.unsubscribe(topic);
            }
        });
    }

    public end(force: boolean = true): Promise<this> {
        return new Promise((resolve) => {
            this.client.end(force, () => {
                resolve(this);
            });
        });
    }

    public onError(error: Error) {
        this.trigger(new TBrokerErrorEvent({}, {}));
    }

    public onMessage(topic: string, payload: Buffer) {
        this._emitter.emit(topic, payload);
    }

    private onConnected() {
        this.trigger(new TBrokerConnectedEvent({}, {}));
    }

    private onOffline() {
        this.trigger(new TBrokerOfflineEvent({}, {}));
    }

    private onEnd() {
        this.trigger(new TBrokerEndEvent({}, {}));
    }

    public isConnected(): boolean {
        return this.client.connected;
    }

    public subscribe(topic: string, callback: IBrokerCallback): Promise<SubscribeErrorObject> {
        return new Promise((resolve, reject) => {
            Debug.detail(`Broker subscribed to '${Color.FgCyan}${getFullTopic(this.homeID, topic)}${Color.Reset}'`);

            this.emitter.on(
                getFullTopic(this.homeID, topic),
                (payload: TAnyObj, options: TAnyObj, triggeredTopic: string, topicSubscription: string) => {
                    let processedMessage: IMessage;
                    try {
                        /* convert with different converter for different topics
                        for example if topic is like /home/device/status/info then regular processor
                        for topic /home/zigbeedevice/status/info then converter for zigbee */
                        processedMessage = this._process(payload, topic);
                    } catch(error) {
                        reject({
                            error,
                            topic,
                            payload
                        });
                    }

                    // @TODO: check about this;
                    callback(processedMessage, topic);
                }
            );
        });
    }

    public subscribeSafe(topic: string, callback: IBrokerCallback): this {
        this.subscribe(topic, callback).catch((e: SubscribeErrorObject) => {
            Debug.hcError(e.error);

            const payload = Array.prototype.slice.call(e.payload, 0);

            if (e.payload instanceof Buffer) {
                Debug.error(`Message:`, String.fromCharCode(...payload));
            } else {
                Debug.error(`Message:`, e.payload);
            }


        });

        return this;
    }

    public unsubscribe(topic: string, callback: IBrokerCallback): this {
        this.emitter.removeListener(getFullTopic(this.homeID, topic), callback);

        return this;
    }

    public publish(
        topic: string,
        message: Buffer | string | Object,
        options?: IClientPublishOptions
    ): this {
        Debug.detail(`Broker published to '${Color.FgCyan}${getFullTopic(this.homeID, topic)}${Color.Reset}'`);

        if (message instanceof Buffer || typeof message === "string") {
            this.client.publish(getFullTopic(this.homeID, topic), message, options);
        } else if (message instanceof Object) {
            this.client.publish(getFullTopic(this.homeID, topic), JSON.stringify(message), options);
        }

        return this;
    }

    public publishCommandToThis(uid: string, command: string, message: ICommandMessage): this {
        return this.publish(
            Topic.commandToDevice(uid, command), 
            CommandMessageSchema.check(message) /* @TODO: A sophisticated way of message check is needed:
                                                    each command type needs a different checker.
                                                    So we need a CommandMessageValidator that gets
                                                    the command and the message and checks whether
                                                    both command and message is valid
                                                    CommandMessageSchema only validates that message
                                                    has meta and data. But the data part needs a 
                                                    separate validator for each command!
                                                 */
        );
    }

    public publishCommandToAll(command: string, message: ICommandMessage): this {
        return this.publish(
            Topic.commandToAllDevices(command), 
            CommandMessageSchema.check(message)
        );
    }


}

export default TMQTTBroker;

export {
    EVENT,
    IMQTTBrokerDIConfig
}