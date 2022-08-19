/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

const enum EVENT {
    /** @event NODE_STATE_UPDATE  triggered when one of props has updated */
    NODE_STATE_UPDATE = "node-state-update",
    /** @event NODE_PROPS_UPDATE  triggered when properties has updated  */
    NODE_PROPS_UPDATE = "node-props-update",
    /** @event NODE_PARAMS_UPDATE triggered when device params are updated */
    NODE_PARAMS_UPDATE = "node-params-update",

    /** @event NODE_ATTACH        triggered when NODE attached to the tree */
    NODE_ATTACH = "node-attach",
    /** @event NODE_REMOVE        triggered when NODE removed from the tree */
    NODE_REMOVE = "node-remove",
    /** @event NODELIST_UPDATE    triggered when the whole NODE tree has been updated */
    NODELIST_UPDATE = "nodelist-update",
    /** @event NODE_FAILURE       triggered when an error occured on NODE
     *                              only triggered when status changed to FAILURE */
    NODE_FAILURE = "node-failure",
    /** @event NODE_ERROR         triggered when an unrecoverable error occured on NODE
     *                              only triggered when errorCode changed from "0" to anything else */
    NODE_ERROR = "node-error",

    /** @event NODE_INFO_RECEIVE triggered when device info received from message broker */
    NODE_INFO_RECEIVE = "node-props-receive",
    /** @event NODE_STATE_RECEIVE triggered when device state received from message broker */
    NODE_STATE_RECEIVE = "node-state-receive",
}

export {
    EVENT
}