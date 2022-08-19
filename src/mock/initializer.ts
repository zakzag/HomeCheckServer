/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { IMessageBroker, IMessageBrokerConfig } from "../service/message/MessageBrokerInterface";
import TMQTTBroker from "../service/message/MQTTBroker";
import { TMessagePayload } from "../message/MessageTypes";
import convert from "../message/converter/DefaultConverter";
import normalize from "../message/normalizer/DefaultNormalizer";
import { pipe } from "../util/Util";
import { TAnyObj } from "../util/Types";

function processConfig(content: TAnyObj): any {
    return {
        messageBrokerConfig: content.messageServer,
        deviceListConfig: content.devices,
        logConfig: content.log
    }
}

function process(
    payload: TMessagePayload, 
    topic: string,
    converter: Function = convert,
    normalizer: Function = normalize
): any {
    return pipe(converter, normalizer)(payload);
}


function createMessageBroker(config: IMessageBrokerConfig): IMessageBroker {
    const DIConfig = { process };
    const messageBroker: IMessageBroker = (new TMQTTBroker(DIConfig)).setup(config);
    
    return messageBroker;
}

export { 
    processConfig,
    createMessageBroker
}