/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Static, Union  } from 'runtypes';
import { ResponseMessageSchema } from "./responseMessage/ResponseMessageSchema";
import { CommandMessageSchema } from "./commandMessage/CommandMessageSchema";

const MessageSchema = Union(CommandMessageSchema, ResponseMessageSchema);

type IMessage = Static<typeof MessageSchema>;

export {
    MessageSchema,
    IMessage
}