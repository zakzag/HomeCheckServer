/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import IMessageBroker from "../service/message/MessageBrokerInterface";
import {INodeStatus, IResponseMessage, ITraitValues} from "../schema/schemas";
import {STATUS} from "../node/NodeConstants";

const defaultMockTraits = [{
    name: "trait1",
    value: "trait1value"
}, {
    name: "trait2",
    value: "trait2value"
}];

const defaultStatus = {
    errorCode: "0",
    errorReason: "",
    status: STATUS.WORK,
    busy: false,
}

// ---------- [ Info ] --------------------------

/**
 * Creates an Info message object from provided params.
 *
 * @param {string} uid
 * @param {string} requestId
 * @returns {IResponseMessage}
 */
function createInfoMessage(uid: string = "12:23:43:44", requestId: string = "11-mock-requestid"): IResponseMessage {
    return {
        meta: {
            requestId,
            uid
        },
        data: {
            info: {
                uid,
                type: "wateringstation",
                name: "watering station 1",
                firmwareVersion: "1.0.0",
                params: [{
                    name: "param1",
                    value: "param1value"
                }]

            }
        }
    };
}

/**
 * Publishes an Info Response Message to the Message Broker.
 *
 * @param {IMessageBroker} broker
 * @param {string} uid
 * @param {string} requestId
 * @returns {IResponseMessage}
 */
function publishDeviceInfoMessage(
    broker: IMessageBroker,
    uid: string = "12:23:43:44",
    requestId: string = "11-mock-requestid"
) {
    const infoMessage = createInfoMessage(uid, requestId);

    broker.publish(`${uid}/status/info`, infoMessage);

    return infoMessage;
}

// ---------- [ Status ] --------------------------

/**
 * Creates a Status Response Message from the provided data.
 *
 * @param {string} uid
 * @param {string} requestId
 * @param {ITraitValues} traits
 * @param {INodeStatus} status
 * @returns {IResponseMessage}
 */
function createStatusMessage(
    uid: string = "12:23:43:44",
    requestId: string = "11-mock-requestid",
    traits: ITraitValues = defaultMockTraits,
    status: INodeStatus = defaultStatus
): IResponseMessage {
    return {
        meta: {
            requestId,
            uid
        },
        data: {
            status,
            traits
        }
    }
}

/**
 * Publishes a Status Message Response from the provided data to the Message Broker.
 *
 * @param {IMessageBroker} broker
 * @param {string} uid
 * @param {string} requestId
 * @param {ITraitValues} traits
 * @returns {IResponseMessage}
 */
function publishDeviceStatusMessage(
    broker: IMessageBroker,
    uid: string = "12:23:43:44",
    requestId: string = "11-mock-requestid",
    traits: ITraitValues = defaultMockTraits,
    status: INodeStatus = defaultStatus
): IResponseMessage {
    const statusMessage = createStatusMessage(uid, requestId, traits, status);

    broker.publish(`${uid}/status/state`, statusMessage);

    return statusMessage;
}

export {
    defaultStatus,
    defaultMockTraits,
    createInfoMessage,
    createStatusMessage,
    publishDeviceInfoMessage,
    publishDeviceStatusMessage
}