/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   
import * as mock from 'mock-require';
import * as TestHelper from "../util/TestHelper";

mock("./Util", {
    getAppConfig(): IAppConfig {
        return TestHelper.createMockAppConfig();
    }
});

let DBService: IDBService = TestHelper.createMockDBService();

mock("../service/db/DBService", {
    default: DBService
});

import { expect } from 'chai';
import HCError from "./HCError";
import { IDBService } from '../service/db/DBService';
import { IAppConfig } from '../Application';

describe("HCError", () => {
    it("should store message",() => {
        const message: string ="message";
        const error = new HCError(message);
        
        expect(error.message).to.be.eq(message);
    });

    it("should return multiple messages concatenated when errors are recursive",() => {
        const message1: string ="message1";
        const message2: string ="message2";
        const expectedMessage:string = message2 + " " + message1;

        const error1 = new HCError(message1);
        const error2 = new HCError(message2, error1);

        expect(error2.message).to.be.eq(expectedMessage);
    });


    it("should restore multiple messages when errors are recursive",() => {
        const message1: string ="message1";
        const message2: string ="message2";
        const expectedMessage:string = message2 + " " + message1;

        const error1 = new HCError(message1);
        const error2 = new HCError(message2, error1);

        expect(error2.message).to.eq(expectedMessage);
    });


});