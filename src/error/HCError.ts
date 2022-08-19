/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

/**
 * HCError is the base class for all the Home Check Server errors.
 * Works as expected, no special behaviour.
 */
class HCError extends Error {
    name: string = "HCError";

    constructor(message: string, source?: HCError) {
        super(message +
            (source instanceof Error ?
                    " " + source.message : ""
            )
        );
    }
}

export default HCError;