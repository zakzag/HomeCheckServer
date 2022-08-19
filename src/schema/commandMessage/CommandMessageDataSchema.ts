/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Record, Static, String, Array } from 'runtypes';
import { ParamSchema } from '../ParamSchema';

const CommandMessageDataSchema = Record({
    command: String,
    params: Array(ParamSchema)
});
    
type ICommandMessageData = Static<typeof CommandMessageDataSchema>;

export {
    CommandMessageDataSchema,
    ICommandMessageData
}