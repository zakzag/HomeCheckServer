/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import TNode, { INodeDIConfig, INodeConfig } from "../node/Node";
import { INodeState } from "../node/NodeState";
import * as Topic from "../message/TopicHelper";
import { INodeProps } from "../node/NodeProps";
import { MSG_STATUS } from "../message/MessageConstants";
import { hcError } from "../util/Debug";
import { extend } from "../util/Util";
import { STATUS as NODE_STATUS } from "../node/NodeConstants";
import { ITraits } from "../schema/trait/TraitsSchema";
import {ICommandDescriptor, IInfoForResponse, IResponseMessage, TParamObject} from "../schema/schemas";
import * as Debug from "../util/Debug";
import TCommand, { TCommandMap } from "../command/Command";
import { Record } from "runtypes";
import {checkFields } from "../util/Types";

import {composeCommandMessageFromCmd} from "../message/MessageComposer";
import CommandFactory from '../command/CommandFactory';
import baseDeviceCommands from "./BaseDeviceCommands";
import {IDeviceNode} from "./DeviceNodeInterface";
import {convertParamListToObject} from "../util/ParamUtils";

class TDeviceNode extends TNode implements IDeviceNode {
    /* Trait list is not stored in database as it is derived from device type
     * It means that all classes derived from DeviceNode must set their traits */
    /** Sensor/Actuator list for the device */
    protected _traits: ITraits;
    /**
     * Tells whether this device is active in the network or not. Active flag is false by default.
     * On startup, server sends a "get-info" command to the broadcast (home/device/command/*) 
     * command topic, and all the devices answering this command and sending a valid "info" status 
     * message, will be set to active. Another way to make device active if the device proactively sends 
     * valid info message to the broadcast topic (home/device/status/info).
     * If a device is considered as not active in server, but sends status or any other status message,
     * the message will be dropped.
     */
    protected active: boolean = false;

    protected _params: TParamObject;
    protected set params(params: TParamObject) { this._params = params; }
    protected get params(): TParamObject { return this._params; }

    /**
     * Commands that device can send
     */
    public static commands: TCommandMap;

    constructor(config?: INodeConfig) {
        super(config);
    }

    /**
     * Setup is used to set all the required props and state and references for a Node
     * @param config dependency injection config 
     */
    public setup(config: INodeDIConfig): this {
        super.setup(config);

        this._messageBroker
            .subscribeSafe(Topic.statusFromDevice(this.uid, MSG_STATUS.ONLINE), this.onOnlineReceived.bind(this))
            .subscribeSafe(Topic.statusFromDevice(this.uid, MSG_STATUS.OFFLINE), this.onOfflineReceived.bind(this))
            .subscribeSafe(Topic.statusFromDevice(this.uid, MSG_STATUS.STATE), this.onStateReceived.bind(this))
            .subscribeSafe(Topic.statusFromDevice(this.uid, MSG_STATUS.INFO), this.onInfoReceived.bind(this));

        TDeviceNode.createCommands(baseDeviceCommands);

        return this;
    }

    /**
     * Create a list of commands from Command Descriptors.
     * @see Command.ts
     *
     * @param {ICommandDescriptor[]} commandDescriptors
     */
    public static createCommands(commandDescriptors: ICommandDescriptor[]): void {
        TDeviceNode.commands = TDeviceNode.commands || {};

        commandDescriptors.forEach((commandDescriptor: ICommandDescriptor) => {
            // when string is given, get class from the factory, and no need additional data
            if (typeof commandDescriptor === "string") {
                TDeviceNode.commands[commandDescriptor] =
                    new (CommandFactory.get(commandDescriptor).itemClass)();
            } else {
                commandDescriptor.schema = Record(commandDescriptor.paramTypes);
                TDeviceNode.commands[commandDescriptor.name] = new TCommand<any>(commandDescriptor);
            }
        });
    }

    /**
     * Publishes a command to the (actual)device using Message Broker.
     * The params will be checked
     * @param {string} cmd
     * @param {TParamObject} params
     */
    public sendCommand(cmd: string, params: TParamObject) {
        try {
            let command = TDeviceNode.commands[cmd];

            if (!command) {
                throw new Error(`Command does not exist: '${cmd}' on device '${this.name}'`);
            }

            checkFields(command.schema, params);

            this._messageBroker.publishCommandToThis(
                this.uid,
                command.topic,
                composeCommandMessageFromCmd(command.composeMessageData(params))
            );
        } catch (e) {
            throw new Error(`while sending command: ${e.name} ${e.message}`);
        }
    }

    protected onOnlineReceived(): void {
        Debug.detail(`ONLINE received: ${this.uid}`);
        this.state.status.status = NODE_STATUS.WORK;
    }

    protected onOfflineReceived(): void {
        Debug.detail(`OFFLINE received: ${this.uid}`);
        this.state.status.status = NODE_STATUS.SLEEP;
    }

    protected onStateReceived(response: IResponseMessage): void {
        Debug.detail(`STATE received: ${this.uid}`);

        try {
            let state: INodeState = extend<INodeState>(<any>{
                timestamp: Date.now(),
            }, <any>response.data);

            this.setState(state);
        } catch (e) {
            hcError(e);
        }
    }

    protected onInfoReceived(response: IResponseMessage): void {
        const props: INodeProps = {
            ...this.props,
            ...((response.data as IInfoForResponse).info),
            lastUpdate: (new Date()).valueOf(),
        };

        this.setProps(props);
        this.saveProps();
    }

    public setProps(props: Partial<INodeProps>): void {
        super.setProps(props);

        this.params = convertParamListToObject(this.props.params);
    }

    public getCommand(name: string): TCommand<any> {
        return TDeviceNode.commands[name];
    }

    public get commands(): TCommandMap {
        return TDeviceNode.commands;
    }

    public goSleep() {
        /* Start from here: 
             MessageComposer should have a new method that can compile a command message
             where should messages be checked??? 
         */

        //this._messageBroker.publishCommandToThis(this.uid, MSG_CMD.GO_SLEEP, {});
    }


    get traits(): ITraits {
        return this._traits;
    }
}

export default TDeviceNode;