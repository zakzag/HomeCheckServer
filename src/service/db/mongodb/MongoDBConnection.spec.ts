/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import * as mock from 'mock-require';
const MongoClient = {
    connect: async (url) => {
        return true;
    }
}
mock("mongodb", { MongoClient });

import { expect } from "chai";
import * as chai from 'chai';
import * as TH from "../../../util/TestHelper";
import { IDBConnectionConfig } from "../DBConnectionInterface";
import TMongoDBConnection from "./MongoDBConnection";

TH.setupTests();

describe("TMongoDBConnection", () => {
    let dbConn: TMongoDBConnection;
    let mongoClient;
    let conn;
    let mockCfg: IDBConnectionConfig = {
        url: "mockURL",
        port: 1998,
        username: "mockuser",
        password: "mockpass",
        database: "mockdb"
    }

    beforeEach(() => {
        dbConn = new TMongoDBConnection();
        mongoClient = TH.createMockMongoClient();

        conn = new TMongoDBConnection().inject({
            client: mongoClient
        });
    });

    it("Should have all necessary methods", () => {
        expect(dbConn.connect).to.exist;
        expect(dbConn.getDB).to.exist;
        expect(dbConn.disconnect).to.exist;
    });

    it("Should call underlying connection's connect method", () => {
        //GIVEN
        MongoClient.connect = chai.spy(MongoClient.connect);
        //WHEN
        conn.connect(mockCfg);
        //THEN
        expect(MongoClient.connect).to.be.called;
        expect(MongoClient.connect).to.be.called.with("mongodb://mockuser:mockpass@mockURL:1998");
    });
});