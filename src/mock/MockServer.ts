/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

 /**
  * MockServer is a class that represents a server for mock devices. It can init, run, control and stop
  * mock devices. This is the class that needs to be included into integration tests
  */
import TBaseMockDevice, { IMockDeviceProps } from "./device/Base";
import IMessageBroker from "../service/message/MessageBrokerInterface";
import { processConfig, createMessageBroker } from "./initializer";
import { generateRequestID, random } from "../util/Util";
import { TAnyObj } from "../util/Types";
import TWateringStationMockDevice from './device/wateringStation/WateringStationMockDevice';
import * as Debug from "../util/Debug";
import TNuclearRadiationDetectorMockDevice from "./device/nuclearRadiationDetector/NuclearRadiationDetectorMockDevice";
import { loadConfig } from "../util/Config";

class TMockServer {
    protected messageBrokerConfig: TAnyObj;
    protected logConfig: TAnyObj;

    private mockDeviceList: Array<TBaseMockDevice> = [];
    private registeredMockDevices: Map<string, any> = new Map<string, any>();
    private messageBroker: IMessageBroker;
    private deviceList: Array<TBaseMockDevice>;
    private homeID: string;

    constructor(configFilename: string) {
        this.setDir();
        const { messageBrokerConfig, deviceListConfig, logConfig } = processConfig(loadConfig("mockServer"));
        this.initDebugger(logConfig);
        this.logConfig = logConfig;

        this.messageBroker = createMessageBroker(messageBrokerConfig);
        this.deviceList = deviceListConfig;
        this.homeID = messageBrokerConfig.homeID;

        this.registerMockDevices();
    }

    public run() {
        this._run().catch((err) => {
            Debug.error(`Fatal error running: ${this.homeID}: ${err.message ? err.message : err}`);
            Debug.info("trying to restart...");
            let fork = require('child_process').fork;
            let child = fork(__filename);
    
            Debug.info(child);
            process.exit();
        });
    }

    private async _run() {
        await this.initMessageBroker(this.messageBroker);
        this.initMockDevices();
    }

    private setDir() {
        //process.chdir(path.dirname(__filename));
    }

    private registerMockDevices() {
        this.registeredMockDevices.set("wateringstation", TWateringStationMockDevice);
        Debug.info("Registering device type: ", "wateringstation", typeof TWateringStationMockDevice);
        this.registeredMockDevices.set("nuclear-radiation-detector", TNuclearRadiationDetectorMockDevice);
        Debug.info("Registering device type: ", "nuclear-radiation-detector");
        this.registeredMockDevices.set("node", undefined);
        Debug.info("Registering device type: ", "node");
    }
    
    private initMockDevices() {
        Debug.info("Adding new devices to server");

        this.deviceList.forEach((device: TAnyObj | undefined) => {
            const typeClass = this.getRegisteredMockDeviceClass(device.props.type);
            Debug.info("Adding device type", device.props.type, typeof typeClass);
            setTimeout(() => {
                typeClass && this.addMockDevice(typeClass, device);
            }, random(0, 1000));
        });
    }

    private async initMessageBroker(msgBroker) {
        await msgBroker.connect();
        Debug.info("Connected to message server");
        //Debug.info(`Subscribed to ${Topic.allInfoStatus()}`);
    }

    private addMockDevice(typeClass: new (props: IMockDeviceProps, state: TAnyObj) => TBaseMockDevice, deviceObj) {
        Debug.detail("\n---------------------------------------------------------------------------")
        Debug.detail(`Creating device: ${deviceObj.props.type} (${deviceObj.props.uid})...`);
        Debug.detail("PROPS:", deviceObj.props);
        const device = (new typeClass(deviceObj.props, deviceObj.state)).init(this.messageBroker);
        this.mockDeviceList.push(device);
        device.publishInfo(generateRequestID());
    }

    private initDebugger(logConfig: Debug.IDebugConfig) {
        Debug.setup(logConfig);
    }

    private getRegisteredMockDeviceClass(type: string): any {
        return this.registeredMockDevices.get(type);
    }
}

export default TMockServer;
