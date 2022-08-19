/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

/**
 * Message Broker will trigger these events when needed. Only for brokers!
 */
enum EVENT {
    BROKER_CONNECT = "broker-connected",
    BROKER_ERROR = "broker-error",
    BROKER_END = "broker-end",
    BROKER_OFFLINE = "broker-offline"
}

/**
 * These events are built-in for MQTT client,
 */
enum MQTT_EVENT {
    CONNECT = "connect",
    MESSAGE = "message",
    ERROR = "error",
    END = "end",
    OFFLINE = "offline",
    ONLINE = "online"
}


export {
    EVENT,
    MQTT_EVENT
}