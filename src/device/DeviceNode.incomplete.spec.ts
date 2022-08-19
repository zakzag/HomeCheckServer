/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import * as TH from "../util/TestHelper";
import TDeviceNode from './DeviceNode';
import TNodeProps from "../node/NodeProps";
import TNodeState from '../node/NodeState';
import { expect } from "chai";
import * as chai from 'chai';
import {
    Number as R_Number,
    String as R_String,
    Boolean as R_Boolean,
    Record
} from "runtypes";


TH.setupTests();

describe("TDeviceNode", () => {
    let device: TDeviceNode;

    const testCmdName1: string = "testCmd";
    const testCmdName2: string = "testCmd2";

    let testParamTypes = {
        mode: R_Number,
        top: R_String,
        isClosed: R_Boolean
    }

    const testCommandDescriptor = (name: string) => {
        return {
            name: name,
            uniqueName: "uniqueName",
            caption: 'TestCaption 1',
            description: "test description",
            topic: "tets-topic",
            paramTypes: testParamTypes,
            schema: undefined
        }
    };

    let messageBroker = TH.createMockMessageBroker();

    beforeEach(() => {
        device = new TDeviceNode({
            props: TNodeProps.defaultProps,
            state: TNodeState.defaultState
        }).setup({
            db: TH.createMockDBService().Node,
            messageBroker
        });

    });

    it("setup should call subscribe on messageBroker", () => {
        // GIVEN
        messageBroker.subscribeSafe = chai.spy(messageBroker.subscribeSafe);

        // WHEN
        device.setup({
            db: TH.createMockDBService().Node,
            messageBroker
        });

        //THEN
        expect(messageBroker.subscribeSafe).to.be.called.exactly(4)
    });

    it("should create commands and their schemas", () => {
        // GIVEN
        let commandDescriptors = [
            testCommandDescriptor(testCmdName1),
            testCommandDescriptor(testCmdName2)
        ];

        // WHEN
        TDeviceNode.createCommands(commandDescriptors);

        // THEN
        expect(device.commands[commandDescriptors[0].name]).to.be.exist;
        expect(device.commands[commandDescriptors[1].name]).to.be.exist;

        const expectedSchemaFields0 = Object.keys((<any>Record(commandDescriptors[0].paramTypes).fields));
        const schemaFields0 = Object.keys((<any>device.commands[commandDescriptors[0].name].schema).fields);

        expect(schemaFields0).to.be.deep.equal(expectedSchemaFields0);

        const expectedSchemaFields1 = Object.keys((<any>Record(commandDescriptors[0].paramTypes).fields));
        const schemaFields1 = Object.keys((<any>device.commands[commandDescriptors[0].name].schema).fields);

        expect(schemaFields1).to.be.deep.equal(expectedSchemaFields1);
    });

    /* CHECK createCommands with string  */

    it("should throw, when sending command with wrong command params", () => {
        // GIVEN
        let commandDescriptors = [
            testCommandDescriptor(testCmdName1)
        ];

        TDeviceNode.createCommands(commandDescriptors);

        // WHEN
        // THEN
        expect(device.sendCommand.bind(null, testCmdName1, { a: "a" })).to.throw();
    });

    it("should throw error, when sending non-defined command", () => {
        // GIVEN
        let commandDescriptors = [
            testCommandDescriptor(testCmdName1)
        ];

        TDeviceNode.createCommands(commandDescriptors);

        // WHEN
        // THEN
        expect(device.sendCommand.bind(null, testCmdName2, {})).to.throw();
    });

    it("should call publish when command and its params are correct", () => {
        // GIVEN
        let commandDescriptors = [
            testCommandDescriptor(testCmdName1)
        ];

        TDeviceNode.createCommands(commandDescriptors);

        messageBroker.publish = chai.spy(messageBroker.publish);

        // WHEN
        device.sendCommand(testCmdName1, {
            mode: 1,
            top: "11",
            isClosed: true
        });
        // THEN
        expect(messageBroker.publish).to.be.called();
    });
});
