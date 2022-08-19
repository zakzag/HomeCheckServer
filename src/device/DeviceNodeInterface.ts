/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import INode from "../node/NodeInterface";
import {INodeDIConfig} from "../node/Node";
import {TParamObject} from "../schema/schemas";
import TCommand, {TCommandMap} from "../command/Command";

interface IDeviceNode extends INode {

    setup(config: INodeDIConfig): this;
    sendCommand(cmd: string, params: TParamObject);
    getCommand(name: string): TCommand<any>;
    commands: TCommandMap;

}

export {
    IDeviceNode
}