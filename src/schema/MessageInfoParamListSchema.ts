/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {IParam, IParamList, ParamListSchema, ParamSchema} from "./ParamSchema";

const MessageInfoParamSchema = ParamSchema;
const MessageInfoParamListSchema = ParamListSchema;
type  IMessageInfoParam = IParam;
type  IMessageInfoParamList = IParamList;

export {
    MessageInfoParamSchema,
    MessageInfoParamListSchema,
    IMessageInfoParam,
    IMessageInfoParamList
}
