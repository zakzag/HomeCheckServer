/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {Static, Record} from "runtypes";
import {NodeStateSchema} from "../../../../schema/schemas";


/**
 * Used in WebApi Messages
 */

const WebApiNodeFailureSchema = Record({
    status: NodeStateSchema
});

type IWebApiNodeFailure = Static<typeof WebApiNodeFailureSchema>;

export {
    WebApiNodeFailureSchema,
    IWebApiNodeFailure
}