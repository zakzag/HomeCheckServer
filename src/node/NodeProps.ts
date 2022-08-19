/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { INodeProps } from '../schema/NodePropsSchema';
import { extend } from '../util/Util';
import { IParamList } from "../schema/schemas";

class TNodeProps implements INodeProps {
    public uid: string;
    public name: string;
    public type: string;
    public enabled: boolean;
    public firmwareVersion: string;
    public createdAt: number;
    public lastUpdate: number;
    public params: IParamList;

    public static defaultProps: INodeProps = {
        uid: "",
        name: "",
        type: "",
        enabled: true,
        firmwareVersion: "",
        createdAt: 0,
        lastUpdate: 0,
        params: []
    };
    
    /**
     * Constructor can be used 2 ways:
     * * if data is another NodeProps class instance then it makes a clone of it
     * * if data is plain object, constructor will create a new nodeProps instance
     *   and fills it with data provided
     *   
     * @param data 
     * @throws InvalidNodePropsError
     */
    constructor(data: INodeProps) {
        /* if data is a TNodeProp instance then makes a clone */
        if (data instanceof TNodeProps) {
            return new TNodeProps({ ...data});

        /* if just a simple object then merges it with defaultProps 
           to fill missing properties then creates a new NodeProps */
        } else if (data instanceof Object && data !== null) {
            /* for..in loop was used, because Object.assign is not really useful
               in this situation: this = Object.assign(this, expandedData) 
               would throw an error, "this" is not writable */
            for (let key in data) {
                this[key] = data[key];
            }
        
        /* In every other case we just throw an error because data can only be an object */
        } else {
            //throw new InvalidNodePropsError(`Invalid props type: '${typeof data}' instead of Object`);
        }
    }

    public static create(data: Partial<INodeProps> = {}): TNodeProps {
        return new TNodeProps(<INodeProps>extend(TNodeProps.defaultProps, data));
    }
}

export default TNodeProps;

export {
    INodeProps
}