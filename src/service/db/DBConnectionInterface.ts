/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

interface IDBConnectionConfig {
    url: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export default interface IDBConnection {
    setup();
    getDB(): any;
    connect(dbConfig: IDBConnectionConfig): Promise<any>;

    /**
     * Disconnects from the server
     *
     * @returns {Promise<any>}
     */
    disconnect(): Promise<any>;

    /**
     * List all existing databases in the currently connected server
     * @returns {Promise<any[]>}
     */
    getDatabaseList(): Promise<any[]>;

    /**
     * List all existing tables
     *
     * @returns {Promise<string[]>}
     */
    getTableList(): Promise<string[]>;

    /**
     * Checks whether the dbName exist in the database
     *
     * @param {string} dbName
     * @returns {Promise<boolean>}
     */
    checkIfDatabaseExists(dbName:string): Promise<boolean>;

    /**
     * Removes a table from the currently connected database
     *
     * @param {string} tableName
     */
    dropTable(tableName: string): Promise<boolean>;

    /**
     * Creates a new table in the currently opened database
     * @param {string} tableName
     */
    createTable(tableName: string): Promise<any>;
    client: any;
}

export {
    IDBConnectionConfig
}