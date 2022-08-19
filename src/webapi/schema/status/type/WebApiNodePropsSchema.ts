/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {Static, Record} from "runtypes";
import {NodePropsSchema} from "../../../../schema/NodePropsSchema";

/**
 * Used in WebApi Messages
 */

const WebApiNodePropsSchema = Record({
    props: NodePropsSchema
});

type IWebApiNodeProps = Static<typeof WebApiNodePropsSchema>;

export {
    WebApiNodePropsSchema,
    IWebApiNodeProps
}