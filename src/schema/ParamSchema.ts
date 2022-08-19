/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { String, Record, Static, Array } from 'runtypes';

const ParamSchema = Record({
    name: String,
    value: String
});

const ParamListSchema = Array(ParamSchema);

type IParam = Static<typeof ParamSchema>;
type IParamList = Static<typeof ParamListSchema>;

export {
    ParamSchema,
    ParamListSchema,
    IParam,
    IParamList
}
