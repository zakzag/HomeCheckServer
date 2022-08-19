/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {ICommandDescriptor} from "../schema/schemas";
import { String } from "runtypes";

let baseDeviceCommands: ICommandDescriptor[] = [
  {
    "name": "get-state",
    // @"ODO": either remove topic or make name camelCase
    "uniqueName": "device.getstatus",
    "caption": "Provide Status",
    "description": "Provide Status",
    "topic": "get-state",
    "paramTypes": {}
  },
  {
    "name": "get-info",
    "uniqueName": "device.getinfo",
    "caption": "Provide Info",
    "description": "Povide info",
    "topic": "get-info",
    "paramTypes": {}
  },
  {
    "name": "set-params",
    "uniqueName": "device.setparams",
    "caption": "Set Parameters",
    "description": "Set Device Parameters",
    "topic": "set-params",
    "paramTypes": {}
  },
  {
    "name": "go-sleep",
    "uniqueName": "device.gosleep",
    "caption": "Go Sleep",
    "description": "Send device to deep sleep",
    "topic": "go-sleep",
    "paramTypes": {
      "duration": String
    }
  }
]

export default baseDeviceCommands;
