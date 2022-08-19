/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

/* tslint:disable:no-console */

import Color from "../util/Colors";
import {IAppConfig} from "../Application";
import IMessageBroker from "../service/message/MessageBrokerInterface";
import TMQTTBroker from "../service/message/MQTTBroker";

import {createDBConnection} from "../util/DBHelper";
import {h1, ul, ulError, ulInfo} from "../util/TextFormatter";
import DBService from "../service/db/DBService";
import {ConfigError, DBError} from '../error/ErrorConstants';
import { getAppConfig } from "../util/Config";

let messageBroker: IMessageBroker;
run();

// -------------------------------------------------------------

async function run() {
    const env = "dev";

    try {
        h1("Initializing HomeCheck server");
        ul(`Checking config against environment:'${env}'`);
        checkConfig(env);
        ul("Checking message broker availability");
        await checkMessageBroker(env);
        ulInfo("MQTT server is OK");

        ul("Checking database server availability");
        await checkDatabaseServer(env);
        ulInfo("Database server is OK");
        ul("Initializing database");
        await initDatabase(env);
        h1(`All set, start server by typing ${Color.FgRed}npm run start${Color.Reset}`);
        process.exit();
    }
    catch (e) {
        console.error(`${Color.FgRed}A fatal error occured: ${e.message}${Color.Reset}`);
        console.error(e.stack);
        process.exit();
    }
}

function checkConfig(env) {
    const configDefault = getAppConfig('default');
    const configObj = getAppConfig(env);

    for (const i in configDefault) {
        const nType = typeof configObj[i]
        if (nType != "object" && nType != "string" && i != "_comment") {
            throw new ConfigError(`Config for environment '${env}' has missing mandatory field: '${i}'`);
        }
    }

    ulInfo("Configs are OK");
}

async function checkMessageBroker(env) {
    let config: IAppConfig = getAppConfig(env);
    messageBroker = (new TMQTTBroker()).setup(config.messageBroker);

    await messageBroker.connect();
}

async function checkDatabaseServer(env: string) {
    // it throws an error when unable to connect
    const dbConn = await createDBConnection(env);

    return dbConn;
}

async function initDatabase(env: string) {
    try {
        let config = getAppConfig(env);

        let databases = await DBService.Connection.getDatabaseList();

        if (isDBExists(config.db.database, databases)) {
            throw new DBError(`Database ${config.db.database} already exists, run ${Color.FgRed}npm run init -f${Color.Reset} to initialize new database, and remove existing one.`);
        }
    } catch (e) {
        ulError(e);
    }
}

function isDBExists(dbName, list): boolean {
    return list.filter((item) => {
        return dbName === item.name;
    }).length > 0;

}

