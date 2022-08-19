/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   

 /**
  * Commands sent to devices through message broker
  * 
  * @readonly
  * @enum
  */
const enum MSG_CMD {
    /** Instructs device to tell its state */
    GET_STATE = "get-state",
    /** Instructs device to tell additional information about the device */
    GET_INFO = "get-info",
    /** instructs device to go to sleep mode */
    GO_SLEEP = "go-sleep",
    /** set trait as described in payload */
    SET_PARAMS = "set-param",
}

const enum MSG_STATUS {
    /** status message */
    STATE = "state",
    /** info message */
    INFO = "info",
    /** response to go_sleep: acknowledged */
    /*SLEEP_ACK = "sleep-ack",*/
    /** response to go_sleep: not acknowledged, payload must have details */
    /*SLEEP_NAK = "sleep-nak",*/
    /** device is online, ready to work */
    ONLINE = "online",
    /** device is offline after this message */
    OFFLINE = "offline"
}

const enum TOPIC {
    ALL_MULTI = "#",
    ALL_ONE = "+",
    DEVICE = "device",
    GATEWAY = "gateway"
}

const enum MSG_TYPE {
    STATUS = "status",
    COMMAND = "command"
}

const DELIMITER = "/";

export {
    MSG_CMD,
    MSG_STATUS,
    MSG_TYPE,
    TOPIC,
    DELIMITER
}