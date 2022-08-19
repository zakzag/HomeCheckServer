/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Union, Literal, Static } from "runtypes";
import { STATUS } from "../node/NodeConstants";

const StatusTypeSchema = Union(
    Literal(STATUS.FAILURE),
    Literal(STATUS.WORK),
    Literal(STATUS.SLEEP),
    Literal(STATUS.UNAVAILABLE)
);

type IStatusType = Static<typeof StatusTypeSchema>;

export {
    StatusTypeSchema,
    IStatusType
}