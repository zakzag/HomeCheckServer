/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Record, Static } from 'runtypes';

import { ResponseMessageDataSchema } from './ResponseMessageDataSchema';
import { ResponseMessageMetaSchema } from './ResponseMessageMetaSchema';

const ResponseMessageSchema = Record({
    meta: ResponseMessageMetaSchema,
    data: ResponseMessageDataSchema
});

type IResponseMessage = Static<typeof ResponseMessageSchema>;

export {
    ResponseMessageSchema,
    IResponseMessage
}