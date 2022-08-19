/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import TBaseMockDevice, { IMockDeviceProps } from './Base';
import { generateUID, generateDeviceName } from "../../util/Util";
import { setupTests, createMockMessageBroker } from "../../util/TestHelper";
import * as chai from 'chai';
import { expect } from 'chai';
import { TAnyObj } from '../../util/Types';
import IMessageBroker from '../../service/message/MessageBrokerInterface';
import { IMockDeviceState } from '../MockTypes';
import TNodeState from '../../node/NodeState';
import { STATUS as NODE_STATUS, STATUS } from "../../node/NodeConstants";

setupTests();

let globalMockBroker: IMessageBroker;

function createMockDevice(props: IMockDeviceProps, state: IMockDeviceState = TNodeState.defaultState): TBaseMockDevice {
    return ((new TBaseMockDevice(props, state)).init(globalMockBroker));
}

function generateDeviceProps(): IMockDeviceProps {
    return {
        uid: generateUID(),
        name: generateDeviceName(),
        type: "test",
        status: STATUS.WORK,
        firmwareVersion: "0.1.0",
        params: []
    }
}

function generateDeviceState(): IMockDeviceState {
    return {
        status: {
            errorCode: "0",
            errorReason: "",
            status: NODE_STATUS.WORK,
            busy: false,
        },
        traits: []
    }
}

describe("TBaseMockDevice", () => {
    beforeEach(() => {
        globalMockBroker = createMockMessageBroker();
    });

    it("Should fill up props and state", () => {
        // GIVEN
        const props: IMockDeviceProps = generateDeviceProps();
        const state: IMockDeviceState = generateDeviceState();
        const mockDevice: TBaseMockDevice = createMockDevice(props, state);

        // WHEN
        // THEN
        expect(mockDevice.props).to.be.deep.equal(props);
        expect(mockDevice.state).to.be.deep.equal(state);

        
    });

    it("Should setup mock device for use and subscribe for messages", () => {
        // GIVEN
        const props: IMockDeviceProps = generateDeviceProps();

        const mockDevice = new TBaseMockDevice(props, generateDeviceState());

        globalMockBroker.subscribeSafe = chai.spy(globalMockBroker.subscribeSafe);

        mockDevice.init(globalMockBroker);

        // WHEN
        // THEN
        // two subscribing has been done
        expect(mockDevice.broker.subscribeSafe).to.be.called.exactly(5);

        // we expect that broker property is properly set
        expect(mockDevice.broker).to.be.equal(globalMockBroker);
    });

    it("Should extend state", () => {
        // GIVEN
        const props: IMockDeviceProps = generateDeviceProps();
        const state: TAnyObj = {
            a: 1,
            b: 2,
            c: 3
        }
        
        const extension = {
            c:4
        }

        const expectedState = {
            a:1,
            b:2,
            c:4,
            status: {
                errorCode: "0",
                errorReason: "",
                status: NODE_STATUS.WORK,
                busy: false,
            }
        }

        const mockDevice: TBaseMockDevice = createMockDevice(props, <any>state);

        // WHEN
        mockDevice.setState(extension);

        // THEN
        expect(mockDevice.state).to.be.deep.equal(expectedState);
    });
});