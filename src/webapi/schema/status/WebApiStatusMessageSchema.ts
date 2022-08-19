/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {Record, Static} from 'runtypes';


import {WebApiStatusMessageMetaSchema} from "./WebApiStatusMessageMetaSchema";
import {WebApiStatusMessageDataSchema} from "./WebApiStatusMessageDataSchema";

/**
 * This message type is for WebAPI, to transfer status messages from the server to the clients
 * meta part is completely same as in MQTT for now. If it's getting changed
 */
const WebApiStatusMessageSchema = Record({
    meta: WebApiStatusMessageMetaSchema,
    data: WebApiStatusMessageDataSchema
});

type IWebApiStatusMessage = Static<typeof WebApiStatusMessageSchema>;

export {
    WebApiStatusMessageSchema,
    IWebApiStatusMessage
}