/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {Literal, Static, Record} from "runtypes";
import {API_NODE_ACTION} from "../../../WebApiConstants";


/**
 * Used in WebApi Messages
 *
 * Message Data when Nodelist is changed (node added/removed)
 */

const WebApiNodeListUpdateDataSchema = Record({
    nodeAction: Literal(API_NODE_ACTION.REMOVE)
        .Or(Literal(API_NODE_ACTION.UPDATE))
        .Or(Literal(API_NODE_ACTION.NODELIST_UPDATE))
        .Or(Literal(API_NODE_ACTION.ADD))
});

type IWebApiNodeListUpdateData = Static<typeof WebApiNodeListUpdateDataSchema>;

export {
    WebApiNodeListUpdateDataSchema,
    IWebApiNodeListUpdateData
}