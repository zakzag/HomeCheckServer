import {compose, generateRequestID} from "../util/Util";
import {IWebApiStatusMessageData} from "./schema/status/WebApiStatusMessageDataSchema";
import {IMessage, IWebApiStatusMessage, WebApiStatusMessageSchema} from "../schema/schemas";

/**
 * Creates a general message used in communication of WebAPI between client and server
 * This message type is for sending props, state, params, etc. from server to client
 *
 * @param {string} requestId
 * @param {string} uid
 * @param {TAnyObj} data
 * @returns {IWebApiStatusMessage}
 */
function composeWebApiStatusMessage(
    requestId: string = generateRequestID(),
    uid: string,
    data: IWebApiStatusMessageData
): IWebApiStatusMessage {
    return compose(WebApiStatusMessageSchema.check, envelopeWebApiMessage)([{
        uid,
        requestId
    }, {
        ...data
    }]);
}

/**
 * Creates an envelope object for the message
 *
 * @param datameta a tuple of meta and data
 * @returns an enveloped object ready for sending
 */
function envelopeWebApiMessage(
    datameta: Array<any>
): IMessage {
    return {
        meta: datameta[0],
        data: datameta[1]
    };
}


export {
    composeWebApiStatusMessage
}