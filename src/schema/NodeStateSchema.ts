/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Number, Record, Static, Undefined, Optional } from 'runtypes';

import { TraitValuesSchema } from './trait/TraitValuesSchema';
import {StatusSchema} from "./StatusSchema";

const fields = {
    timestamp: Number,
    status: StatusSchema,
    traits: TraitValuesSchema.Or(Undefined)
}

const NodeStateSchema = Record(fields);
const NodeStatePartialSchema = Record({}).And(Optional(Record(fields)));

type INodeState = Static<typeof NodeStateSchema>;

export {
    NodeStateSchema,
    NodeStatePartialSchema,
    INodeState,
}