/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import  TNode, { INodeConfig, INodePartialConfig } from "./Node";

import TFactory from "../Factory";
import TNodeProps from "./NodeProps";
import { UnknownTypeError } from '../error/ErrorConstants';
import { extend } from "../util/Util";
import TNodeState from "./NodeState";
import INode from "./NodeInterface";
import Color from "../util/Colors";
import * as Debug from "../util/Debug";

class TNodeFactory extends TFactory<INode> {

    public register(itemType: string, itemClass: { new(...args: any[]): TNode }): this {
        Debug.info(`Registering node type: "${itemType}"`);
        return super.register(itemType, itemClass);
    }
    /**
     * Creates a new node using one of registered node types
     * The constructor class is defined by props.type
     * This method does not make references to stateHistory, prevProps, prevState
     * 
     * @param state 
     * @param props 
     */
    public createFromData(config: INodePartialConfig): INode {
        const extendedConfig: INodeConfig = {
            props: extend(TNodeProps.defaultProps, config.props),
            state: extend(TNodeState.defaultState, config.state)
        }

        if (!this.isRegisteredType(extendedConfig.props.type)) {
            throw new UnknownTypeError(`Type: ${extendedConfig.props.type} is not a registered node type`);
        }

        Debug.info(`Creating node ${Color.FgGreen}${extendedConfig.props.name}@${extendedConfig.props.type}` +
            `${Color.FgRed}#${extendedConfig.props.uid}${Color.Reset}`);


        // @TODO: why are they commented out?
        //NodePropsSchema.check(extendedConfig.props);
        //NodeStateSchema.check(extendedConfig.state);
        
        return this.create(extendedConfig.props.type, extendedConfig);
    }
}

/* Singleton factory */
let NodeFactory: TNodeFactory = new TNodeFactory();

export default NodeFactory;

export {
    TNodeFactory
}