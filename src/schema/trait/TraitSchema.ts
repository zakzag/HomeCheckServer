/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { String, Record, Static } from 'runtypes';

const TraitSchema = Record({
    name: String,
    type: String
});

type ITrait = Static<typeof TraitSchema>;

export {
    TraitSchema,
    ITrait
}