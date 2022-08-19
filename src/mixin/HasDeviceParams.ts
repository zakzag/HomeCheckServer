/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Constructor } from "../util/Util";
import { Runtype } from "runtypes";
import {TParamObject} from "../schema/ParamMapSchema";

interface IHasDeviceParams<TBase extends Constructor, > {
    params: TParamObject;
    paramSchema: Runtype
} 

function HasDeviceParams<TBase extends Constructor>(Base: TBase) {
    return class extends Base implements IHasDeviceParams<TBase> {
        public params: TParamObject;
        public paramSchema: Runtype;

        constructor(...params: any[]) {
            super(...params);
        }

        // @TODO: replace any to something else;
        checkParams(): any {
            return this.paramSchema.check(this.params);
        }
    }
}

export default HasDeviceParams;

export { 
    IHasDeviceParams
}