/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/


import { InvalidNodeStateError } from '../error/ErrorConstants';
import { extend } from '../util/Util';
import {ITraitValues, INodeStatus, INodeState} from "../schema/schemas";
import {STATUS} from "./NodeConstants";


class TNodeState implements INodeState {
    public timestamp: number = 0;
    public busy: boolean;
    public available: boolean;

    public status: INodeStatus;
    public traits: ITraitValues;
    public static defaultState: INodeState = new TNodeState({
        timestamp: 0,
        status: {
            errorCode: "0",
            errorReason: "",
            status: STATUS.WORK,
            busy: false
        },
        traits: []
    });

    /**
     * Constructor can be used 2 ways:
     * * if data is another NodeState class instance then it makes a clone of it
     * * if data is plain object, constructor will create a new nodeState instance
     *   and fills it with data provided
     *
     * @param data
     */
    constructor(data: INodeState = TNodeState.defaultState) {
        if (data instanceof TNodeState) {
            /* when constructor returns object, not primitive then 
               it ignores the object "this" refers to */
            return new TNodeState({ ...data });
        } else if (data instanceof Object && data !== null) {
            let expandedData = extend(TNodeState.defaultState, data);
            for (let key in expandedData) {
                this[key] = expandedData[key];
            }
        } else {
            throw new InvalidNodeStateError(`Invalid state type: '${typeof data}' instead of Object`);
        }
    }

    /**
     * Creates a new instance of TNodeState using data if provided
     * @param data
     */
    public static create(data: Partial<INodeState> = TNodeState.defaultState) {
        return new TNodeState(<INodeState>extend(TNodeState.defaultState,data));
    }
}

export default TNodeState;

export {
    INodeState
}