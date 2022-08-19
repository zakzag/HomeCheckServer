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

const WebApiNodeStateSchema = Record({
    status: NodeStateSchema
});

type IWebApiNodeState = Static<typeof WebApiNodeStateSchema>;

export {
    WebApiNodeStateSchema,
    IWebApiNodeState
}