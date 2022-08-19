/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {compose, generateRequestID} from "../util/Util";
import {IBaseMockDevice, IMockDeviceProps} from "../mock/MockTypes";
import TCommand from "../command/Command";
import {
    CommandMessageSchema,
    ICommandMessage,
    ICommandMessageData,
    IMessage,
    INodeStatus,
    IResponseMessage,
    IResponseMessageMeta,
    ResponseMessageSchema,
    TParamObject,
} from "../schema/schemas";

import {convertObjectToParamList} from "../util/ParamUtils";

/**
 * Composes a response for get-info request
 * @param device
 * @param requestId
 * @returns
 */
function composeInfoResponse(device: IBaseMockDevice, requestId: string = generateRequestID()): IResponseMessage {
    return compose(ResponseMessageSchema.check, envelopeMessage)([
        composeResponseMeta(device.props.uid, requestId),
        {
            info: getInfoDataFromDevice(device)
        }
    ]);
}

/**
 * Composes a response to get-state command request
 * @param device
 * @param requestId
 * @returns
 */
function composeStateResponse(device: IBaseMockDevice, requestId: string = generateRequestID()): IResponseMessage {
    return compose(ResponseMessageSchema.check, envelopeMessage)([
        composeResponseMeta(device.props.uid, requestId),
        {
            status: getStatusDataFromDevice(device),
            traits: device.state.traits
        }
    ]);
}

/**
 * INCOMPLETE: composes a response with error message
 * @param status
 * @param requestId
 * @returns
 */
function composeErrorResponse(status: INodeStatus, requestId: string = generateRequestID()): ICommandMessage {
    return compose(CommandMessageSchema.check, envelopeMessage)([{requestId}, {status}]);
}

/**
 * INCOMPLETE: it!s a not yet used command response message composer function
 * @param {string} requestId
 * @returns {IResponseMessage}
 */
function composeCommandResponseMessage(requestId: string = generateRequestID()): IResponseMessage {
    return compose(ResponseMessageSchema.check, envelopeMessage)([{requestId}, {status: {}}]);
}

/**
 * Creates a command Message from a CommandMessageData structure (used in TCommand)
 * @param {ICommandMessageData} data
 * @returns {ICommandMessage}
 */
function composeCommandMessageFromCmd(data: ICommandMessageData): ICommandMessage {
    return compose(CommandMessageSchema.check, envelopeMessage)([{
        requestId: generateRequestID()
    },
        data
    ]);
}

/**
 * Creates a command message using command string and params
 *
 * @param {string} command
 * @param {TParamObject} args
 * @returns {ICommandMessage}
 */
function composeCommandMessage(command: string, args: TParamObject): ICommandMessage {
    return compose(CommandMessageSchema.check, envelopeMessage)([{
        requestId: generateRequestID()
    }, {
        command,
        params: TCommand.convertParamsToObj(args)
    }]);
}

/**
 * Envelopes all required data in an object for sending in a message.
 *
 * @param datameta a tuple of meta and data
 * @returns an enveloped object ready for sending
 */
function envelopeMessage(
    datameta: Array<any>
): IMessage {
    return {
        meta: datameta[0],
        data: datameta[1]
    };
}

/**
 * Creates the META part of a response message
 *
 * @param uid
 * @param requestId
 */
function composeResponseMeta(uid: string, requestId: string): IResponseMessageMeta {
    return {
        uid,
        requestId
    }
}

/**
 * Returns a Status object based on a device
 *
 * @param {IBaseMockDevice} device
 * @returns {INodeStatus}
 */
function getStatusDataFromDevice(device: IBaseMockDevice): INodeStatus {
    return {
        errorCode: device.state.status.errorCode,
        errorReason: device.state.status.errorReason,
        status: device.state.status.status,
        busy: device.state.status.busy
    }
}

function getInfoDataFromDevice(device: IBaseMockDevice): IMockDeviceProps {
    return {
        uid: device.props.uid,
        name: device.props.name,
        type: device.props.type,
        status: device.state.status.status,
        params: convertObjectToParamList(device.params),
        firmwareVersion: device.props.firmwareVersion
    }
}


export {
    composeStateResponse,
    composeInfoResponse,
    composeErrorResponse,
    composeCommandMessageFromCmd,
    composeCommandMessage,
    composeCommandResponseMessage,
    envelopeMessage,
}