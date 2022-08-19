/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import * as DBService from "./mongodb/MongoDBService";
import IDBConnection, { IDBConnectionConfig } from "./DBConnectionInterface";
import IDBNodeService, { IDBNodeServiceDIConfig } from "./DBNodeServiceInterface";
import IDBListService, { IDBListServiceDIConfig } from "./DBListServiceInterface";
import TDBConnectionBase from "./DBConnectionBase";

interface IDBService {
    Connection: IDBConnection;
    Node: IDBNodeService;
    List: IDBListService;
}

export default DBService;

export {
    TDBConnectionBase,      
    IDBService,
    IDBNodeService,
    IDBNodeServiceDIConfig,
    IDBListService,
    IDBListServiceDIConfig,
    IDBConnection,
    IDBConnectionConfig
}