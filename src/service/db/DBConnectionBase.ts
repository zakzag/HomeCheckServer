/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { IDBConnectionConfig, IDBConnection } from './DBService';


export default class TDBConnectionBase implements IDBConnection {
    protected _dbConfig: IDBConnectionConfig;

    setup() {
        // this is intentional
    }

    async connect(dbConfig: IDBConnectionConfig): Promise<any> {
        throw new Error("Not Implemented");
    }

    async disconnect() {
        throw new Error("Not Implemented");
    }

    async getDatabaseList(): Promise<string[]> {
        throw new Error("Not Implemented");
    }

    async getTableList(): Promise<string[]> {
        throw new Error("Not Implemented");
    }

    async checkIfDatabaseExists(dbName:string): Promise<boolean> {
        throw new Error("Not Implemented");
    }

    async dropTable(tableName: string): Promise<boolean> {
        throw new Error("Not Implemented");
    }

    async createTable(tableName: string): Promise<any> {
        throw new Error("Not Implemented");
    }

    getDB(): object {
        throw new Error("Not Implemented");
    }

    get client(): any {
        throw new Error("Not Implemented");
    }
}