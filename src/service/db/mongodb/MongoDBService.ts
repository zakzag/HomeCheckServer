/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import TMongoDBConnection from "./MongoDBConnection";
import TMongoDBNodeService from "./MongoDBNodeService";
import TMongoDBListService from "./MongoDBListService";
import IDBConnection from '../DBConnectionInterface';

/**
 * MongoDB Injection config for dbConnection
 */
let connection: IDBConnection = new TMongoDBConnection();

// no inject here, only when connection done (Application injects connection object)
const nodeService = new TMongoDBNodeService();
const treeService = new TMongoDBListService();

export {
    TMongoDBConnection as TDBConnection,
    TMongoDBNodeService as TDBNodeService,
    TMongoDBListService as TDBListService,
    connection as Connection,
    nodeService as Node,
    treeService as List
}