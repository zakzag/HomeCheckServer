/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {ParamListSchema} from "../../../../schema/ParamSchema";
import {Static, Record} from "runtypes";

/**
 * Used in WebApi Messages
 */

const WebApiNodeParamsSchema = Record({
    params: ParamListSchema
});

type IWebApiNodeParams = Static<typeof WebApiNodeParamsSchema>;

export {
    WebApiNodeParamsSchema,
    IWebApiNodeParams
}