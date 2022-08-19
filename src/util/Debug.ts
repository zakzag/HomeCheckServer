/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/


import * as fs from "fs";
import HCError from "../error/HCError";
import Color from "./Colors";

enum DebugLevel {
    DETAIL = 6,
    INFO = 5,
    LOG = 4,
    WARNING = 3,
    ERROR = 2,
    FATAL = 1,
    NONE = 0
}

interface IDebugConfig {
    logdir: string;
    name: string;
    level: number;
    maxSize: number;
    fileLog: boolean;
    consoleLog: boolean;
    consoleLogLevel: number;
}

let config: IDebugConfig;
let isReady = false;
/**
 * Sets up debug functions for logging into file by setting filename and logging level
 * These config params will be global for the whole application
 * 
 * @param _filename Filename relative to application root dir
 * @param _level    Level of debugging, @see TDebugLevel above
 */
function setup(_config: IDebugConfig) {
    config = _config;
    isReady = true;

    const logDir = `${config.logdir}`;

    try {
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }
    } catch(e) {
        console.error(`ERROR on attempting create dir ${logDir}: `, e.message);
    }
}

/**
 * 
 * @param message log an entry
 * @param level 
 */
function log(message: string, level: DebugLevel = 4) {
    if (!isReady) {
        // tslint:disable-next-line: no-console
        console.info("Debug has not been setup:", message);
        return;
    }

    if (config.level >= level && config.fileLog) {
        writeLogEntryToFile(message, level);
    }

    if (config.consoleLogLevel >= level && config.consoleLog) {
        if (level == 1 || level == 2) {
            printLogEntry(`${Color.FgRed}${message}${Color.Reset}`, level);
        } else if (level == 3) {
            printLogEntry(`${Color.FgYellow}${Color.FgBlack}${message}${Color.Reset}`, level);
        } else {
            printLogEntry(message, level);
        }
    }
}

function detail(...message: any[]) {
    log(glueMessage(message), DebugLevel.DETAIL);
}

function info(...message: any[]) {
    log(glueMessage(message), DebugLevel.INFO);
}

function warn(...message: any[]) {
    log(glueMessage(message), DebugLevel.WARNING);
}

function error(...message: any[]) {
    if (message[0] instanceof Error) {
        log(`(${message[0].name}): ${message[0].message}`, DebugLevel.ERROR);
        console.info(message[0].stack);
    } else {
        log(glueMessage(message), DebugLevel.ERROR);
    }

}

function fatalError(...message: any[]) {
    log(glueMessage(message), DebugLevel.FATAL);
}

function hcError(e: HCError, indent: string = "") {
    error(`${indent}Application Error: (type:${e.name}): ${e.message}`);
}

function glueMessage(message: any[]): string {
    return message.reduce((prev, last) => {
        if (typeof last === "object") {
            return prev + " " + JSON.stringify(last, null, 2);
        } else {
            return prev + " " + last;
        }
    }, "");
}

function writeLogEntryToFile(message: string, level: number) {
    const date = (new Date()).toISOString().replace(/T.*/g, "");
    const msg = `${(new Date()).toISOString().replace(/T/g, " ").replace(/\..*/g, "")} ${getLevelStr(level)}: ${message}`;

    const filename = `${config.logdir}/${config.name || "default"}-${date}.log`;

    try {
        fs.appendFileSync(filename, msg + "\n");
    } catch (e) {
        console.error("ERROR on attempting write to LOG: ", e.message);
    }
}

function printLogEntry(message: string, level: number) {
    const msg = `${Color.FgWhite}${(new Date()).toISOString().replace(/T/g, " ").replace(/\..*/g, "")} `+
        `${getLevelStr(level)}: ${Color.Reset}${message}`;

    /* tslint:disable:no-console */
    console.info(msg);
    /* tslint:enable:no-console */
}

function getLevelStr(level: number) {
    const levelMap = {
        1: "FATAL ERROR",
        2: "ERROR ",
        3: "WARN  ",
        4: "LOG   ",
        5: "INFO  ",
        6: "DETAIL"
    }

    return levelMap[level] || "LOG";
}

export {
    IDebugConfig,
    setup,
    log,
    detail,
    info,
    warn,
    error,
    fatalError,
    hcError,
}