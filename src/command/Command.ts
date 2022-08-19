/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
/* TCommand class: represents a possible command for a device. 
   This command will be sent to physical device via MQTT, sent by the logical device from server. 
   A command have a unique name and a param list
 */

import {
    ICommandDescriptor,
    CommandDescriptorSchema,
    ICommandMessageData,
    IParam,
    TParamMapType,
    TParamObject
} from "../schema/schemas";
import {Runtype} from 'runtypes';
import {checkFields} from "../util/Types";

/** Named map of commands as cmdName: actualCommand  */
export type TCommandMap = { [_: string]: TCommand<any> }; // @TODO: change any to something meaningful

/** Represents a Command descriptor in the system */
export default class TCommand<CommandParams extends TParamObject> {
    /** Name of the command, used in message params */
    public name: string;
    /** Globally unique name */
    public uniqueName: string;
    /** Readable name, Used in UI */
    public caption: string;
    /** Readable description in UI */
    public description: string;
    /** Used in topic names when sending messages */
    public topic: string;

    public paramTypes: TParamMapType;
    public schema: Runtype;
    public composedMessage: string = "";
    public params: CommandParams;

    constructor(config: ICommandDescriptor) {
        checkFields(CommandDescriptorSchema, config);

        Object.assign(this, config); // copies config props to the actual object
    }

    static convertParamsToObj(params: TParamObject): IParam[] {
        let paramObj: IParam[] = [];

        for (let key in params) {
            paramObj.push({
                name: key,
                value: String(params[key]) // @TODO: Any to String conversion is ok for now, but needs rethinking
            });
        }

        return paramObj;
    }

    setParams(params: CommandParams): CommandParams {
        // @TODO: change <any> to proper type
        this.params = <any>this.validateParams(params);

        return this.params;
    }

    composeMessageData(params: CommandParams): ICommandMessageData {
        this.setParams(params);

        return {
            command: this.name,
            params: TCommand.convertParamsToObj(this.params)
        };
    }

    validateParams(params: TParamObject): TParamObject {
        try {
            return <TParamObject>this.schema.check(params);
        } catch (e) {
            throw new Error(`${e.key} ${e.message}`); // it's because schema validationerror 
                                                      // won't tell which field has failed
        }
    }
}