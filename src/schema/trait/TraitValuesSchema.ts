/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Array, Static } from 'runtypes';
import  { TraitValueSchema } from './TraitValueSchema';

/* Runtype types */
const TraitValuesSchema = Array(TraitValueSchema);

/* Compile time types */
type ITraitValues = Static<typeof TraitValuesSchema>;

export {
    TraitValuesSchema,
    ITraitValues
}