/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   

import { IResponseMessage } from "../../schema/schemas";

function normalize(message: string): IResponseMessage {
    const innerObj = JSON.parse(message);

    return {
        "meta": innerObj.meta,
        "data": innerObj.data
    }
}

export default normalize;