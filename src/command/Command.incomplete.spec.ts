/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import * as TH from "../util/TestHelper";
import TCommand from './Command';
import { Number, String, Record } from "runtypes";
import { expect } from "chai";
import { ICommandDescriptor } from "../schema/schemas";

TH.setupTests();

describe("TCommand", () => {

    const paramTypes = {
        top: Number,
        left: String
    }

    const schema = Record(paramTypes);

    beforeEach(() => {

    });

    it('Should store config values', () => {
        // GIVEN
        // WHEN
        const commandConfig = {
            name: "Test CmdName",
            uniqueName: "uniqueName",
            caption: "Test Caption",
            description: "Test Description",
            topic: "test topic",
            paramTypes: {},
            schema
        }

        const command = new TCommand<any>(commandConfig);
        // THEN

        expect(command.name).to.be.equal(commandConfig.name);
        expect(command.caption).to.be.equal(commandConfig.caption);
        expect(command.description).to.be.equal(commandConfig.description);
        expect(command.topic).to.be.equal(commandConfig.topic);
        expect(command.paramTypes).to.be.equal(commandConfig.paramTypes);
        expect(command.schema).to.be.equal(commandConfig.schema);
    });

    it("should check validity", () => {
        const commandConfig: ICommandDescriptor = {
            name: "Test Something",
            uniqueName: "uniqueName2",
            caption: "Test Anything",
            description: "Test title",
            topic: "test topic2",
            paramTypes,
            schema
        }

        const command = new TCommand<any>(commandConfig);
        const params = {
            top: "wrong",
            left: "Something"
        }
        expect(command.validateParams.bind(null, params)).to.throw();
    })
});
