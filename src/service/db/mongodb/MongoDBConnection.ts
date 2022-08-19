/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { IDBConnection, IDBConnectionConfig, } from "./../DBService";
import { TObservable, TInjectable } from "../../../mixin/mixins";
import TDBConnectionBase from "../DBConnectionBase";
import * as MongoDB from "mongodb";
import { DBError } from '../../../error/ErrorConstants';
import * as Debug from "../../../util/Debug";

class TMongoDBConnection 
    extends TInjectable(TObservable(TDBConnectionBase))
    implements IDBConnection {

    protected _client: MongoDB.MongoClient;
    protected _db: MongoDB.Db;

    async connect(dbConfig: IDBConnectionConfig): Promise<any> {
        this._dbConfig = dbConfig;
        let url:string;

        if (this._dbConfig.username && this._dbConfig.password) {
            Debug.detail("MongoDB: username/password provided, using authentication for login");
            url = `mongodb://${this._dbConfig.username}:${this._dbConfig.password}@${this._dbConfig.url}:${this._dbConfig.port}`;
        } else {
            Debug.detail("MongoDB: No username or password provided, login without authentication");
            url = `mongodb://${this._dbConfig.url}:${this._dbConfig.port}`;
        }
        
        this._client = await MongoDB.MongoClient.connect(url, { /*useUnifiedTopology: true*/ });

        // this is needed when no database in the connection string defined
        this.getDB();
        
        return this._client;
    }

    disconnect(): Promise<any> {
        return new Promise((resolve) => {
            this.client.close(resolve);
        });
    }

    getDB(): MongoDB.Db {
        if (this._db instanceof MongoDB.Db) {
            return this._db;
        }

        if (!this.client) {
            throw new DBError("Unable to get database. This mostly happens, when connection is not established");
        }

        this._db = this.client.db(this._dbConfig.database);

        return this._db;
    }

    async getDatabaseList(): Promise<any[]> {
        return (await this._db.admin().listDatabases()).databases;
    }

    async getTableList(): Promise<string[]> {
        return (await this._db.listCollections().toArray()).map(item => item.name);
    }

    async checkIfDatabaseExists(dbName:string): Promise<boolean> {
        const dbList = await this.getDatabaseList();

        return dbList.reduce((last, current) => last || current.name === dbName, false);
    }

    async dropTable(tableName: string): Promise<boolean> {
        return await this._db.dropCollection(tableName);
    }

    async createTable(tableName: string): Promise<any> {
        return await this._db.createCollection(tableName);
    }

    get client(): MongoDB.MongoClient {
        return this._client;
    }
}

export default TMongoDBConnection;