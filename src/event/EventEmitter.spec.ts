/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   
import * as TH from "../util/TestHelper";
import * as chai  from "chai";
import { expect } from "chai";
import TEventEmitter from "./EventEmitter";
import ICallback from "./EventCallback";
TH.setupTests();

describe("TEventManager", () => {
    let man:TEventEmitter<TH.TEvent>;
    let eventType: string;

    beforeEach(() => {
        eventType = "testevent";
        man = new TEventEmitter<TH.TEvent>(eventType);
    });

    it("Should store event type", () => {
        //GIVEN
        //WHEN
        //THEN
        expect(man.eventType).to.be.equal(eventType);
    });

    it("Should register callback and call it when necessary", () => {
        //GIVEN
        let callback:ICallback<TH.TEvent> = chai.spy(() => { });
        //WHEN
        man.add(callback);
        man.trigger(new TH.TEvent("testEvent"));
        //THEN
        expect(callback).to.has.been.called.once;
    });

    it("Should register 2 callbacks and call them when necessary", () => {
        //GIVEN
        let callback:ICallback<TH.TEvent> = chai.spy(() => { });
        let callback2:ICallback<TH.TEvent> = chai.spy(() => { });
        //WHEN
        man.add(callback).add(callback2).trigger(new TH.TEvent("testEvent"));
        //THEN
        expect(callback).to.has.been.called.once;
        expect(callback2).to.has.been.called.once;
    });

    it("Should not call removed items", () => {
        //GIVEN
        let callback1:ICallback<TH.TEvent> = chai.spy(() => { });
        let callback2:ICallback<TH.TEvent> = chai.spy(() => { });
        //WHEN
        man.add(callback1).add(callback2).remove(callback1).trigger(new TH.TEvent("testEvent"));
        //THEN
        expect(callback1).to.has.been.called.exactly(0);
        expect(callback2).to.has.been.called.exactly(1);
    });

    it("Should pass the given arguments", () => {
        //GIVEN
        let callback1:ICallback<TH.TEvent> = chai.spy(() => { });
        let msg: TH.TEvent = new TH.TEvent("testEvent", {});
        msg.timestamp = (new Date()).valueOf();

        //WHEN
        man.add(callback1).trigger(msg);
        //THEN
        expect(callback1).to.has.been.called.with.exactly(msg);
    })
});