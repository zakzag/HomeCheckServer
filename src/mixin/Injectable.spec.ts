/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/


import TInjectable from "./Injectable";
import { TUser, setupTests } from "../util/TestHelper";

import { expect } from 'chai';

setupTests();


function createInjectableMockClass() {
    return class TObservableUser extends TInjectable(TUser) {
        public _inject1: Function;
        public _inject2: Function;
        constructor(name: string) {
            super(name);
        }
    }
}

class MockInjectorClass extends createInjectableMockClass() { };

describe("TInjectable", () => {
    let mockObject: MockInjectorClass;
    let testfn1 = function() {};
    let testfn2 = function() {};

    beforeEach(() => {
        mockObject = new MockInjectorClass("testName");
    });

    it("Should have all necessary methods", () => {
        expect(mockObject).to.have.property("inject");
    });

    it("Should have injected properties", () => {
        //GIVEN
        //WHEN
        mockObject.inject({
            inject1: testfn1,
            inject2: testfn2
        });
        //THEN
        expect(mockObject._inject1 instanceof Function).to.be.true;
        expect(mockObject._inject2 instanceof Function).to.be.true;
    });
});