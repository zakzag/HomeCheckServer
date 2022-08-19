/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   
import * as TH from "../util/TestHelper";
import * as chai from "chai";
import { expect } from "chai";
import * as Topic from "./TopicHelper";

TH.setupTests();

describe("TopicHelper", () => {
    it("Should parse topic", () => {
        //GIVEN
        const target: string = "testtarget";
        const type: string = "testtype";
        const name: string = "testname";
        const topic: string = `testtarget/testtype/testname`;

        //WHEN
        const info: Topic.TTopicInfo = Topic.parse(topic);
        //THEN
        expect(info.target).to.be.equal(target);
        expect(info.type).to.be.equal(type);
        expect(info.name).to.be.equal(name);
    });

    it("Should not parse topic with / at the beginning", () => {
        //GIVEN
        //WHEN
        const topic: string = `/testtarget/testtype/testname`;
        //THEN
        expect(() => Topic.parse(topic)).to.throw(Error);
    });

    it("Should compile topic", () => {
        //GIVEN
        const topic: string = "testdevice/testtype/testname";
        // WHEN
        // THEN
        expect(Topic.compile(Topic.parse(topic))).to.be.equal(topic);
    });

    it("should validate topic", () => {
        let result = Topic.verify("home/ablak/121");

        expect(result).to.be.true;
    });

    it("should find error in topic", () => {
        let result = Topic.verify("home/ablak/!111");

        expect(result).to.be.false;
    });

    it.skip("Method commandToAllDevices should compile valid topic", () => {
        // GIVEN
        const command = "command";
        const spy = chai.spy(Topic.compile);

        // WHEN 
        Topic.commandToAllDevices(command);

        // THEN
        expect(spy).to.be.called();
    });

    it.skip("Method allStatusFromDevice should compile valid topic", () => {
        // GIVEN
        const device = "device";
        const spy = chai.spy(Topic.compile);
        // WHEN 
        Topic.allStatusFromDevice(device);

        // THEN
        expect(spy).to.have.been.called();
    });

    it.skip("Method allInfoStatus should compile valid topic", () => {
        // GIVEN
        const spy = chai.spy(Topic.compile);
        // WHEN 
        Topic.allInfoStatus();

        // THEN
        expect(spy).to.be.called();
    });
});