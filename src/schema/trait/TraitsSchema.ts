/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Array as RTArray, Static } from 'runtypes';
import { TraitSchema } from './TraitSchema';

/* Runtype types */
const TraitsSchema = RTArray(TraitSchema);

/* Compile time types */
type ITraits = Static<typeof TraitsSchema>;

export {
    TraitsSchema,
    ITraits
}