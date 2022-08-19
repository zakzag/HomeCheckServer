/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {Static, Undefined} from "runtypes";

/**
 * Used in WebApi Messages
 */

const WebApiGeneralSchema = Undefined;

type IWebApiGeneral = Static<typeof WebApiGeneralSchema>;

export {
    WebApiGeneralSchema,
    IWebApiGeneral
}