/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { String, Record, Static } from 'runtypes';
import {MessageInfoParamListSchema} from "./MessageInfoParamListSchema";

const InfoSchema = Record({
    uid: String,
    name: String,
    type: String,
    firmwareVersion: String,
    params: MessageInfoParamListSchema
});

type IInfo = Static<typeof InfoSchema>;

export {
    InfoSchema,
    IInfo
}
