/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { String, Partial, Unknown, Record, Static } from "runtypes";
import { TParamMapType } from "../ParamMapSchema";
import { Runtype } from 'runtypes';

const CommandDescriptorSchema = Record({
    name: String,
    uniqueName: String,
    caption: String,
    description: String,
    topic: String,
    paramTypes: Unknown
}).And(Partial({
    schema: Unknown
}));

/* paramTypes is redefined because runtypes has no proper type for it */
interface ICommandDescriptorFromSchema extends Static<typeof CommandDescriptorSchema>  {
    paramTypes: TParamMapType;
    schema?: Runtype
}

type ICommandDescriptor = ICommandDescriptorFromSchema|string;  // if string is passed as commanddescriptor
                                                                // command will be taken from the command Factory

export {
    CommandDescriptorSchema,
    ICommandDescriptor
};