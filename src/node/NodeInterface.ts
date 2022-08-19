/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { INodeProps, INodeState } from "../schema/schemas";
import { INodeDIConfig } from "./Node";
import { TAnyObj } from "../util/Types";
import { IObservable, IInjectable } from "../mixin/mixins";

interface INode extends IObservable, IInjectable {
    uid: string;
    name: string;
    type: string;
    enabled: boolean;
    lastUpdate: number;
    props: INodeProps;
    prevProps: INodeProps;
    state: INodeState;
    prevState: INodeState;
    stateHistory: INodeState[];

    setState(state: INodeState): INodeState;
    setProps(props: Partial<INodeProps>): void;
    setup(config: INodeDIConfig): this;
    loadAll(): Promise<void>;
    loadState(): Promise<INodeState>;
    loadStateHistory(filter?: TAnyObj, limit?: number, skip?: number): Promise<INodeState[]>;
    loadProps(): Promise<INodeProps>;
    insertState(): Promise<any>;
    saveProps(): Promise<any>;
    saveAll(): Promise<any>;
}

export default INode;