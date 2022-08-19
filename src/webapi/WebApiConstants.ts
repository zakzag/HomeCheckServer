/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

const enum API_MESSAGE {
    GET_DEVICE = "get-device",
    GET_DEVICE_RESPONSE = "get-device-response",

    NODE_ATTACH = "node-attach",
    NODE_REMOVE = "node-remove",
    NODELIST_UPDATE = "nodelist-update",
    NODE_PROPS_UPDATE = "node-props-update",
    NODE_STATE_UPDATE = "node-state-update",
    NODE_PARAMS_UPDATE = "node-params-update",
    NODE_FAILURE = "node-failure",
    NODE_ERROR = "node-error",

    SERVER_START = "server-start",
    SERVER_STOP = "server-stop",
}

const enum API_NODE_ACTION {
    ADD = "add",
    REMOVE = "remove",
    UPDATE = "update",
    NODELIST_UPDATE = "nodelist-update"
}

type TAPIMessageType = keyof typeof API_MESSAGE;

export {
    API_MESSAGE,
    API_NODE_ACTION,
    TAPIMessageType
}