/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import TDeviceNode from "../DeviceNode";
import HasDeviceParams from "../../mixin/HasDeviceParams";

class TWateringStationDevice extends HasDeviceParams(TDeviceNode) { }
/**
 * This will create all the commands that device can accept besides the default ones
 * (get-info, get-state, set-params, go-sleep)
 */
TWateringStationDevice.createCommands([ ]);

export default TWateringStationDevice;