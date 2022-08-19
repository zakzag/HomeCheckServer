/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {Record, Static} from 'runtypes';
import {
    CommandMessageMetaSchema,
} from '../../../schema/schemas';
import {WebApiCommandMessageDataSchema} from "./WebApiCommandMessageDataSchema";


/**
 * This message type is for WebAPI, to transfer commands from the client
 * Command Message Meta and Data part is completely the same as in MQTT for now
 * if any changes needed, please inherit data and meta structure from different sources!
 *
 * This message type (command) is only for messages coming from client (mobile, web, etc.)
 */
const WebApiCommandMessageSchema = Record({
    meta: CommandMessageMetaSchema,
    data: WebApiCommandMessageDataSchema
});

type IWebApiCommandMessage = Static<typeof WebApiCommandMessageSchema>;

export {
    WebApiCommandMessageSchema,
    IWebApiCommandMessage
}