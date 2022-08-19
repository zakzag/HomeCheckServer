/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

/* 
 * a common topic looks like this: 
 * <homeid>/<source>/<kind>/<status|cmd name>/
 * but homeID will be put in broker
 * 
 * HomeID is mandatory, there's no usage of #
 * 
 * example:
 * 12d3-a456-8fb1/device/status/info
 * 
 * To get all devices info status message from home 12d3-a456-8fb1
 * 12d3-a456-8fb1/device/status/info
 * 
 * To get status info from a particular device
 * 12d3-a456-8fb1/23:a8:aa:9a/status/info
 * 
 * Send a particular command to all devices:
 * 12d3-a456-8fb1/device/command/<command>
 * 
 * Subscribe to all status and command to a particular device:
 * 12d3-a456-8fb1/9a:ef:f3:32/command/#
 * 12d3-a456-8fb1/9a:ef:f3:32/status/#
 * 
 * @author Tamas Kovari
 */

import * as MC from "./MessageConstants";
import { DevelopmentError } from '../error/ErrorConstants';

export interface TTopicInfo {
    target: string,
    type: string,
    name: string
}

const validTopicNameRx = /^[a-zA-Z0-9_\-:.]*$/;

/**
 * Verifies a topic whether valid or not.
 * Returns true if valid.
 * 
 * @param topic  Topic to verify
 */
function verify(topic: string):boolean {
    const parts: Array<string> = topic.split(MC.DELIMITER);

    return parts.reduce((last, part: string) => validTopicNameRx.test(part) && last, true);
}

/**
 * Parses a topic by splitting into parts, and returns a
 * parsed object having all info.
 * 
 * @param topic   Topic to parse
 */
function parse(topic: string): TTopicInfo {
    if (topic[0] === "/") {
        throw new DevelopmentError("Topic can't start with '/'");
    }

    const parts: Array<string> = topic.split(MC.DELIMITER);

    const [ target, type, name ] = parts;
    return { target, type, name }
}

function getFullTopic(homeID: string, topic: string): string {
    return `${homeID}/${topic}`
}

/**
 * Compiles a topic from a TTopicInfo object. Does not verify.
 * 
 * @param topicInfo   Object to compile from
 */
function compile(topicInfo: TTopicInfo): string {
     return `${topicInfo.target}/${topicInfo.type}/${topicInfo.name}`;
}


/**
 * Returns a topic that sends a command to all the devices
 * (for SERVER, sending ONE COMMAND to ALL DEVICES)
 * 
 *  
 * @param command  The command to send.
 */
function commandToAllDevices(command: string) {
    return compile({
        target: MC.TOPIC.DEVICE,
        type: MC.MSG_TYPE.COMMAND,
        name: command
    });
}

/**
 * Creates a topic which is for sending all command messages to a particular device
 * (for ONE DEVICE, to catch ALL COMMANDS)
 * 
 * @param device    The device we need status from
 */
function allCommandsToDevice(device: string) {
    return compile({
        target: device,
        type: MC.MSG_TYPE.COMMAND,
        name: MC.TOPIC.ALL_MULTI
    });
}

/**
 * Creates a topic that catches a specified message to a particular device
 * (for ONE DEVICE, to catch ONE COMMAND)
 * 
 * @param device    The device we need status from
 * @param command   The command message name
 */
function commandToDevice(device: string, command: string) {
    return compile({
        target: device,
        type: MC.MSG_TYPE.COMMAND,
        name: command
    });
}

/**
 * Creates a topic that catches a specified status message to a particular device
 * (for SERVER to catch ONE STATUS from ONE DEVICE)
 * 
 * @param device    The device we need status from
 * @param status    The status message name
 * 
 */
function statusFromDevice(device: string, status: string) {
    return compile({
        target: device,
        type: MC.MSG_TYPE.STATUS,
        name: status
    });
}

/**
 * Creates a topic that catches all status messages from a particular device
 * (for SERVER to catch ALL STATUS from ONE DEVICE)
 * 
 * @param device    The device we need status from
 */
function allStatusFromDevice(device: string) {
    return compile({
        target: device,
        type: MC.MSG_TYPE.STATUS,
        name: MC.TOPIC.ALL_MULTI
    });
}

/**
 * Creates a topic that catches info status from all devices from a home
 * (for SERVER to catch STATUS from ALL DEVICE)
 */
function allInfoStatus() {
    return compile({
        target: MC.TOPIC.ALL_ONE,
        type: MC.MSG_TYPE.STATUS,
        name: MC.MSG_STATUS.INFO
    });
}


export {
    verify,
    parse,
    getFullTopic,
    compile,
    commandToAllDevices,
    allCommandsToDevice,
    commandToDevice,
    statusFromDevice,
    allStatusFromDevice,
    allInfoStatus
}