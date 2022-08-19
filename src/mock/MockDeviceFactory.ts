/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import TFactory from "../Factory";
import TBaseMockDevice from "./device/Base";
import { TAnyObj } from "../util/Types";
import { INodeProps } from "../node/NodeProps";

class TMockDeviceFactory extends TFactory<TBaseMockDevice> {
    constructor() {
        super();
    }

    createFromData(props: INodeProps, state: TAnyObj): TBaseMockDevice {
        return MockDeviceFactory.create(props.type, props, state);
    }
}

let MockDeviceFactory: TMockDeviceFactory = new TMockDeviceFactory();

export default MockDeviceFactory;

export {
    TMockDeviceFactory
}
