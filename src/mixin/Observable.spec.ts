/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/



import { TObservable } from "./mixins";
import ICallback from "../event/EventCallback";
import { TUser, setupTests } from "../util/TestHelper";
import * as chai from 'chai';
import { expect } from 'chai';
import TEvent from '../event/Event';

setupTests();


class MockObserverClass extends TObservable(TUser) {}
// --- [ tests ] -----------------------

describe("TObservable", () => {
    // GIVEN
    let mockObject: MockObserverClass;

    class TTest1Event extends TEvent {
        static type = "type1"
    }

    class TTest2Event extends TEvent {
        static type = "type2"
    }


    beforeEach(function() {
        mockObject = new MockObserverClass("something");
    });
    it("Should have all necessary methods", () => {
        // WHEN
        // THEN
        expect(mockObject).to.have.property("on");
        expect(mockObject).to.have.property("off");
        expect(mockObject).to.have.property("addEventType");
        expect(mockObject).to.have.property("trigger");
    });

    it("Should throw error when multiple definition of the same message type", () => {
        // GIVEN
        const messageType:string = "something";
        //WHEN
        mockObject.addEventType(messageType);
        //THEN
        expect(mockObject.addEventType.bind(messageType)).to.throw(Error);
    });

    it("Should register defined message type", () => {
        // GIVEN
        const messageType:string = "something";
        //WHEN
        mockObject.addEventType(messageType);
        // THEN
        expect(mockObject.hasEventType(messageType)).to.be.true;
    });

    it("Should call only the triggered event", () => {
        // GIVEN
        function originalCallback() { }
        function originalCallback2() { }


        let spiedCallback: ICallback<TEvent> = chai.spy(originalCallback);
        let spiedCallback2: ICallback<TEvent> = chai.spy(originalCallback2);
        const messageType:string = TTest1Event.type;
        const messageType2:string = TTest2Event.type;

        // WHEN
        mockObject.addEventType(messageType);
        mockObject.addEventType(messageType2);

        mockObject.on(messageType, spiedCallback);
        mockObject.on(messageType2, spiedCallback2);

        mockObject.trigger(new TTest1Event({}, {}));
        
        // THEN
        expect(spiedCallback).to.have.been.called.once;
    });

    it("Should register multiple events", () => {
        //GIVEN
        let messageTypeList = ["message-1", "message-2", "message-3" ];

        function originalCallback1() { }
        function originalCallback2() { }
        function originalCallback3() { }

        class TTest1Event extends TEvent { static type: string = messageTypeList[0] }
        class TTest2Event extends TEvent { static type: string = messageTypeList[1] }
        class TTest3Event extends TEvent { static type: string = messageTypeList[3] }

        let spiedCallback1: ICallback<TTest1Event> = chai.spy(originalCallback1);
        let spiedCallback2: ICallback<TTest2Event> = chai.spy(originalCallback2);
        let spiedCallback3: ICallback<TTest3Event> = chai.spy(originalCallback3);
        //WHEN
        mockObject.addEventTypes(...messageTypeList);

        mockObject.on(messageTypeList[0], spiedCallback1);
        mockObject.on(messageTypeList[1], spiedCallback2);
        
        mockObject.trigger(new TTest1Event({}, {}));
        mockObject.trigger(new TTest2Event({}, {}));

        //THEN
        
        expect(spiedCallback1).that.have.been.called.once;
        expect(spiedCallback2).that.have.been.called.once;
        expect(spiedCallback3).that.have.not.been.called;


    });
});
