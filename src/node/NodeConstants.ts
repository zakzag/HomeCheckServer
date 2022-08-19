/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

enum STATUS {
    FAILURE = "FAILURE",            // from device
    WORK = "WORK",                  // from device
    SLEEP = "SLEEP",                // derived from messages (went sleep msg arrived)
    UNAVAILABLE = "UNAVAILABLE"     // derived from events (no response)
}

type TNodeErrorCode =
    /** No error */
    "0" |
    /** Wifi cannot connect */
    "wifi-cannot-connect" |
    /** MQTT cannot connect */
    "mqtt-cannot-connect" ;



export {
    TNodeErrorCode,
    STATUS
};