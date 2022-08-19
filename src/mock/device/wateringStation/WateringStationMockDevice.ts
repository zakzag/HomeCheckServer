/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import TBaseMockDevice, { IMockDeviceProps, IBaseMockDevice } from "../Base";
import IMessageBroker from "../../../service/message/MessageBrokerInterface";
import { random } from "../../../util/Util";
import  * as Debug from "../../../util/Debug";
import { IMockDeviceState } from "../../MockTypes";
import { IHasDeviceParams } from "../../../mixin/HasDeviceParams";
import {TAnyObj} from "../../../util/Types";

const enum TWateringStationMode {
    SETUP = "setup",
    AUTOMATIC = "auto",
    REMOTE = "remote"
}

class TWateringStationMockDevice extends TBaseMockDevice implements IBaseMockDevice, IHasDeviceParams<any> {
    private valvePosition: number = random(1,8);
    private waterFlow: boolean = false;
    private mode: TWateringStationMode = TWateringStationMode.REMOTE;
    private moistSensors: Array<number> = (new Array(8)).fill(0).map(value => random(100, 1000));
    public params: TAnyObj;

    constructor(props: IMockDeviceProps, state: IMockDeviceState) {
        super(props, state);

        this.updateState();

       // setInterval((this.onTimer).bind(this), 30000);
    }

    public init(broker: IMessageBroker): this {
        super.init(broker);

        return this;
    }

    protected onTimer() {
        Debug.detail("send info on demand of get-info");

        this.updateState();
        this.moistSensors = (this.moistSensors.map(value => Math.max(Math.min(value + random(0, 20) - 10, 1000), 100)));
        this.valvePosition = random(1, 8);
        this.waterFlow = random(0, 99) < 50;
        

        //this.onReceiveGetState(this.state);

        setTimeout(() => {
            // publish status: went offline
        }, random(0, 100) + 150);
    }

    private updateState() {
        this.setState({
            traits: [
                {
                    name: "mode",
                    value: this.mode
                }, {
                    name: "moisture1",
                    value: this.moistSensors[0]
                }, {
                    name: "moisture2",
                    value: this.moistSensors[1]
                }, {
                    name: "moisture3",
                    value: this.moistSensors[2]
                }, {
                    name: "moisture4",
                    value: this.moistSensors[3]
                }, {
                    name: "moisture5",
                    value: this.moistSensors[4]
                }, {
                    name: "moisture6",
                    value: this.moistSensors[5]
                }, {
                    name: "moisture7",
                    value: this.moistSensors[6]
                }, {
                    name: "moisture8",
                    value: this.moistSensors[7]
                }, {
                    name: "valve-position",
                    value: this.valvePosition
                }, {
                    name: "waterflow",
                    value: this.waterFlow
                }
            ]
        }, true);
    }
}

export default TWateringStationMockDevice;

export {
    TWateringStationMode
}