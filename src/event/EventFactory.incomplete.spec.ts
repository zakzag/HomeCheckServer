/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import * as TH from "../util/TestHelper";
import { expect } from "chai";
import {TEventFactory} from "./EventFactory";
import TEvent from "./Event";

TH.setupTests();

class TestEvent extends TEvent {

}

describe("TEventManager", () => {
    let eventFactory: TEventFactory;

    beforeEach(() => {
        eventFactory = new TEventFactory();
        eventFactory.register(TestEvent);
    });

    it("Should create event", () => {
        // GIVEN
        const event = new TEvent({});
        event;
        // WHEN
        // THEN
        expect(eventFactory);
    });
});

