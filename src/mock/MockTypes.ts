/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {ITraits, IStatusType, ITraitValues, IParamList} from "../schema/schemas";
import {IMessageBroker} from "../service/message/MessageBrokerInterface";
import {TParamObject} from "../schema/ParamMapSchema";

/**
 * Properties for mock devices
 */
interface IMockDeviceProps {
    name: string;
    uid: string;
    type: string;
    status: IStatusType;
    firmwareVersion: string;
    params: IParamList;
}

/**
 * Separate class for status of mock devices
 */
interface IMockDeviceStatus {
    errorCode: string;
    errorReason: string;
    status: IStatusType;
    busy: boolean;
}

/**
 * Separate class for mock traits
 */
interface IMockDeviceTraitValues extends ITraitValues { }
interface IMockDeviceTraits extends ITraits {}

interface IMockDeviceState {
    status: IMockDeviceStatus;
    traits: IMockDeviceTraitValues;
}

interface IBaseMockDevice {
    init(broker: IMessageBroker): this;
    broker: IMessageBroker;
    params: TParamObject;
    state: IMockDeviceState;
    props: IMockDeviceProps;
}

export {
    IMockDeviceProps,
    IMockDeviceStatus,
    IMockDeviceTraitValues,
    IMockDeviceTraits,
    IMockDeviceState,
    IBaseMockDevice
}