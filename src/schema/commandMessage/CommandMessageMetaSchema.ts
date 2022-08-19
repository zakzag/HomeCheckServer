/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { String, Record, Static } from 'runtypes';

const CommandMessageMetaSchema = Record({
    requestId: String
});

type ICommandMessageMeta = Static<typeof CommandMessageMetaSchema>;

export {
    CommandMessageMetaSchema,
    ICommandMessageMeta
}