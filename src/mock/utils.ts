/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { TAnyObj } from "../util/Types";
import { IResponseMessage } from "../schema/schemas";

function compileStatusResponse(
    uid: string, 
    requestId: string,
    payloadName: string,
    payload: TAnyObj,
): IResponseMessage  {
    let response: IResponseMessage = {
        meta: {
            requestId,
            uid 
        },
        data: {
            [payloadName]: payload
        }
    } as IResponseMessage; // this is needed, otherwise can't be compiled

    return response;
}

export {
    compileStatusResponse
}