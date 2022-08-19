/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   
/** Raw payload types of a message. A payload is always raw data, that will be converted to an object
 *  before further processing, it makes possible to send binary or compressed data via MQTT for smaller
 *  payload and unfold it.
 */
type TMessagePayload = string | Buffer | object;

type TMessageCmdCallback = (payload: TMessagePayload) => void;

export {
    TMessagePayload,
    TMessageCmdCallback
}