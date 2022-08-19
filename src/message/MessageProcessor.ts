/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   

/*
 * Message processor transforms raw message data into a well formed object in 3 steps:
 * - converts raw Buffer into a string which must be a 
 * - normalizes message string by converting it into well formed object
 * - checks whether the object fulfills the message schema requirements
 */
import { TMessagePayload } from "./MessageTypes";
import convert from "./converter/DefaultConverter";
import normalize from "./normalizer/DefaultNormalizer";
import { pipe } from "../util/Util";
import { IMessage, MessageSchema } from '../schema/schemas';

/**
 * @file MessageProcessor.ts
 * @description  
 * @author Tamas Kovari
 * 
 */
function process(
    payload: TMessagePayload, 
    topic: string,
    converter: Function = convert,
    normalizer: Function = normalize,
    schemaChecker: Function = MessageSchema.check
): IMessage {
    return <IMessage>pipe(converter, normalizer, schemaChecker)(payload);
}

export default process;
