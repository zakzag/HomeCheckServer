/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { IMessageBroker } from "../../service/message/MessageBrokerInterface";
import { MSG_CMD as CMD, MSG_STATUS } from "../../message/MessageConstants";
import { STATUS as DEVICE_STATUS } from '../../node/NodeConstants';
import { TAnyObj } from "../../util/Types";
import * as Topic from "../../message/TopicHelper";
import { TMessagePayload } from "../../message/MessageTypes";
import * as Debug from "../../util/Debug";
import { extend, generateRequestID } from "../../util/Util";
import {
    IMockDeviceProps,
    IMockDeviceTraits,
    IMockDeviceState,
    IBaseMockDevice
} from "../MockTypes";
import { 
    composeInfoResponse, 
    composeStateResponse, 
    composeCommandResponseMessage 
} from "../../message/MessageComposer";
import { INodeState, ICommandMessage } from "../../schema/schemas";
import { HasDeviceParams } from "../../mixin/mixins";

class TBaseMockDeviceBaseClass {}

class TBaseMockDevice extends HasDeviceParams(TBaseMockDeviceBaseClass) implements IBaseMockDevice {
    protected _props: IMockDeviceProps;
    protected _state: IMockDeviceState;
    protected _broker: IMessageBroker;
    protected _traits: IMockDeviceTraits;
    
    constructor(props?: IMockDeviceProps, state?: IMockDeviceState) {
        super();

        this._props = props;
        this._state = extend<INodeState>({
            status: {
                errorCode: "0",
                errorReason: "",
                status: DEVICE_STATUS.WORK,
                busy: false
            }
        }, state);
    }

    /**
     * Initializes Mock device, and get it working. Init has all the startup code, 
     * that is unable to initialize on creation
     */
    public init(broker: IMessageBroker): this {
        this._broker = broker;

        this.subscribeToCommand(CMD.GET_INFO, (...params: any[]) => { this.onReceiveGetInfo(...params); });
        this.subscribeToCommand(CMD.GET_STATE, (...params: any[]) => { this.onReceiveGetState(...params); });
        this.subscribeToCommand(CMD.GO_SLEEP, (...params: any[]) => { this.onReceiveGoSleep(...params); });
        this.subscribeToCommand(CMD.SET_PARAMS, (...params: any[]) => { this.onSetParams(...params); });

        this.broker.subscribeSafe(
            Topic.commandToAllDevices(CMD.GET_INFO),
            (...params: any[]) => { this.onReceiveGetInfo(...params); }
        )

        this.publishInfo();

        return this;
    }

    /**
     * Method for publishing any status for this particular device
     * Method calculates topic and publish the payload
     * @param statusType   Any registered status type @see 
     * @param payload 
     */
    protected publishStatusMessage(statusType: string, payload: TMessagePayload): void {
        this.broker.publish(
            Topic.statusFromDevice(this.props.uid, statusType),
            payload
        );
    }

    public publishInfo(requestId: string = generateRequestID()) {
        try {
            Debug.detail(`Publishing info: `, this.props);
            this.publishStatusMessage(MSG_STATUS.INFO, composeInfoResponse(this, requestId));
        } catch (e) {
            Debug.warn(`ERROR: ${e.key}: ${e.message}`);
            Debug.warn(console.trace());
        }
    }

    public publishState() {
        //Debug.detail("Params:", params);
        //Debug.detail("Publish state:", composeStateResponse(this, generateRequestID()));
        Debug.detail(`Publish state ${this.props.uid}`);
        try {
            this.publishStatusMessage(MSG_STATUS.STATE, composeStateResponse(this, generateRequestID()));
        } catch (e) {
            Debug.warn(`ERROR: ${e.key}: ${e.message}`);
        }
    }

    protected subscribeToCommand(cmd: string, callback) {
        return this.broker.subscribeSafe(Topic.commandToDevice(this.props.uid, cmd), callback);
    }

    /**
     * Called when command "get-info" arrived
     * 
     * @param payload   Raw payload data from server
     */
    protected onReceiveGetInfo(payload?: ICommandMessage, params?: TAnyObj, topic?: string) {
        Debug.detail(`Device#${this.props.uid} sending device info`);
        // @TODO: requestid from the payload!
        this.publishInfo(undefined);
    }

    /**
     * Called when command "get-state" arrived
     * 
     * @param payload   Raw payload data from server
     * @param params    
     * @param topic 
     */
    protected onReceiveGetState(payload?: ICommandMessage, params?: TAnyObj, topic?: string) {
        Debug.detail(`GET STATE Payload:${payload}, (${typeof payload}) Params:${params}, Topic: ${topic}`);
        Debug.detail(`Device#${this.props.uid} sending device state`);

        this.publishState();
    }

    protected onReceiveGoSleep(payload?: ICommandMessage, params?: TAnyObj, topic?: string) {
        Debug.detail(`GO SLEEP Payload:${payload}, (${typeof payload}) Params:${params}, Topic: ${topic}`);
        Debug.detail(`Device#${this.props.uid} sending response to gosleep`);

        try {
            this.broker.publish(
                Topic.statusFromDevice(this.props.uid, MSG_STATUS.OFFLINE),
                composeCommandResponseMessage(payload.meta.requestId)
            );
        } catch(e) {
            Debug.error(`Error: ${e.key} ${e.message}`);
        }
    }

    protected onSetParams(payload?: ICommandMessage, params?: TAnyObj, topic?: string) {
        Debug.detail(`SET PARAM Payload:${payload}, (${typeof payload}) Params:${params}, Topic: ${topic}`);
        Debug.detail(`Device#${this.props.uid} sending response to gosleep`);

    }

    public get broker(): IMessageBroker {
        return this._broker;
    }

    public get props(): IMockDeviceProps {
        return this._props;
    }

    public get state(): IMockDeviceState {
        return this._state;
    }

    public setState(value: TAnyObj, silent: boolean = false) {
        this._state = <IMockDeviceState>extend(this.state, value);

        if (!silent) {
            // @TODO: check whether it is ok or not (we need !silent, and publishState)
            this.publishState();
        }
    }
}

export default TBaseMockDevice;

export {
    IBaseMockDevice,
    IMockDeviceProps
}