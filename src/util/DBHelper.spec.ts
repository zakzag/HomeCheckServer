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

let DBService:IDBService = TestHelper.createMockDBService();

mock("../service/db/DBService", {
    default: DBService
});

import { IAppConfig } from '../Application';
import { expect } from 'chai';
import * as chai from 'chai';
import * as DBHelper from "./DBHelper";
import { IDBService } from '../service/db/DBService';

mock.stop("./Util");
mock.stop("../service/db/DBService");

describe("DBHelper", async () => {
    it("createDBConnection should call createDBConnectionFromEnv when string provided",async () => {
        // GIVEN
        // WHEN
        DBService.Connection.connect = chai.spy(DBService.Connection.connect);
        await DBHelper.createDBConnection("test");
        // THEN
        expect(DBService.Connection.connect).to.be.called();
    });

    it("createDBConnection should call createDBConnectionFromConfig when object provided",async () => {
        // GIVEN
        // WHEN
        DBService.Connection.connect = chai.spy(DBService.Connection.connect);
        const config = TestHelper.createMockAppConfig().db;
        await DBHelper.createDBConnection(config);

        // THEN
        expect(DBService.Connection.connect).to.be.called.with(config);
    });
});

