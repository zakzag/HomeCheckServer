/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import TFactory from "./Factory";
import * as TH from "./util/TestHelper";
import { expect } from 'chai';

TH.setupTests();

class TTestClass {
    someProp: string;
}

describe("TFactory", () => {
    let msgReg: TFactory<TTestClass>;
    const testItemType = "testItem";

    beforeEach(() => {
        msgReg = new TFactory<TTestClass>();
    });

    it("Should register given event", () => {
        //WHEN
        msgReg.register(testItemType, TTestClass);
        //THEN
        expect(msgReg.get(testItemType).itemClass).to.be.equal(TTestClass);
        expect(msgReg.get(testItemType).itemType).to.be.equal(testItemType);
    });

    it("Should not register given item twice", () => {
        //GIVEN
        msgReg.register(testItemType, TTestClass);
        //THEN
        expect(msgReg.register.bind(msgReg, testItemType, TTestClass)).to.throw(Error);
    });

    it("Shoud throw error when fetching not registered item type", () => {
        //THEN
        expect(msgReg.get.bind(testItemType)).to.throw(Error);
    })

    it("Should store all registered item types", () => {
        //GIVEN
        const testItemType2 = "testItem2";
        //WHEN
        msgReg.register(testItemType, TTestClass);
        msgReg.register(testItemType2, TTestClass);
        //THEN
        expect(msgReg.getRegisteredItems()).to.be.deep.equal([testItemType, testItemType2]);
    });

    it("Should create new item by type", () => {
        //GIVEN
        //WHEN
        msgReg.register(testItemType, TTestClass);
        //THEN
        expect(msgReg.create(testItemType, 1, 2) instanceof TTestClass).to.be.true;
    });

    it("Should throw error when creating not registered item type", () => {
        //GIVEN
        //WHEN
        //THEN
        expect(msgReg.create.bind(testItemType, testItemType, 1, 2)).to.throw(Error);
    });

    it("Should empty the registry when empty method called", ()=>{
        //GIVEN
        msgReg.register(testItemType, TTestClass);

        //WHEN
        msgReg.empty();

        //THEN
        expect(msgReg.getRegisteredItems().length).to.be.equal(0);
    });
});