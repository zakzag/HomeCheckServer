/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   
import { TMessagePayload } from "../MessageTypes";
import HCError from "../../error/HCError";

function convert(payload: TMessagePayload): string {
    if (Buffer.isBuffer(payload)) {
        return  payload.toString();
    } else if (typeof payload === "string") {
        return payload;
    } else {
        throw new HCError(`not recognized payload type: ${typeof payload}`);
    }
}

export default convert;