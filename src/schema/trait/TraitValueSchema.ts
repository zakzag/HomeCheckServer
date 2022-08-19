/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { String, Record, Union, Number, Boolean, Static } from 'runtypes';

const TraitValueSchema = Record({
    name: String,
    value: Union(String, Number, Boolean)
});

type ITraitValue = Static<typeof TraitValueSchema>;

export {
    TraitValueSchema,
    ITraitValue
}