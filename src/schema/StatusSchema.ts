/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Boolean, String, Record, Static } from 'runtypes';
import { StatusTypeSchema } from './StatusTypeSchema';

const StatusSchema = Record({
    errorCode: String,
    errorReason: String,
    status: StatusTypeSchema,
    busy: Boolean,
});

type INodeStatus = Static<typeof StatusSchema>;

export {
    StatusSchema,
    INodeStatus,
}