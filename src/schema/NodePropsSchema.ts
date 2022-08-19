/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Boolean, Number, String, Record, Undefined, Static } from 'runtypes';
import {ParamListSchema} from "./ParamSchema";


// runtime schemas
const NodePropsSchema = Record({
    uid: String,
    name: String,
    type: String,
    enabled: Boolean,
    firmwareVersion: String.Or(Undefined),
    createdAt: Number,
    lastUpdate: Number,
    params: ParamListSchema
});

// compile time types
type INodeProps = Static<typeof NodePropsSchema>;

export {
    NodePropsSchema,
    INodeProps
}