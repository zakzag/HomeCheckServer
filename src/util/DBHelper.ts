/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { IAppConfig } from '../Application';
import DBService, { IDBConnectionConfig } from "../service/db/DBService";
import { getAppConfig } from "./Config";

export async function createDBConnection(data: string | IDBConnectionConfig) {
    if (typeof data == "string") {
        return await createDBConnectionFromEnv(data);
    } else {
        return await createDBConnectionFromConfig(data);
    }
}

export async function createDBConnectionFromEnv(env: string) {
    let config: IAppConfig = getAppConfig(env);

    return await createDBConnectionFromConfig(config.db);
}

export async function createDBConnectionFromConfig(config: IDBConnectionConfig) {
    let conn = DBService.Connection;

    let dbClient = await conn.connect(config);

    DBService.Node.setup()
    DBService.List.setup()

    return dbClient;
}