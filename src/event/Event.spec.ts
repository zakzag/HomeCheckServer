/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   
import * as TH from "../util/TestHelper";
import { expect } from "chai";
import TEvent from "./Event";
import {TAnyObj} from "../util/Types";
TH.setupTests();

class TTestEvent extends TEvent {
    static type: string ="test-event";

    constructor (data: TAnyObj, reason: TAnyObj) {
        super(data, reason);
    }
}

describe("TEvent", () => {
    it("Type and data should match", () => {
        const eventData = {};
        const event = new TTestEvent(eventData, {});

        expect(event.data).to.equal(eventData);
        expect(event.type).to.equal("test-event");
        expect(TTestEvent.type).to.be.equal(event.type);
        expect(typeof event.timestamp).to.be.eq("number");
        expect(event.timestamp).to.be.greaterThan(1000);
    });
});