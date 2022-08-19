/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Record, Static } from 'runtypes';

import { CommandMessageDataSchema } from './CommandMessageDataSchema';
import { CommandMessageMetaSchema } from './CommandMessageMetaSchema';

const CommandMessageSchema = Record({
    meta: CommandMessageMetaSchema,
    data: CommandMessageDataSchema
});

type ICommandMessage = Static<typeof CommandMessageSchema>;

export {
    CommandMessageSchema,
    ICommandMessage
}