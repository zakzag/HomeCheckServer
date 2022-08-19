import {IAppConfig} from "../Application";
import {deepMap, extend} from "./Util";
import {TAnyObj} from "./Types";
import * as fs from "fs";
import {ConfigError} from "../error/ErrorConstants";

function getAppConfig(env = undefined): IAppConfig {
    const config = loadConfig("", env);

    /* this will replace entry values starting with "~" to a value
       getting it from config */
    return <IAppConfig>deepMap(config, (item) => {
        return item[0] === '~' ? config[(item as string).substring(1)] : item;
    });
}

/**
 * AppConfig db and other configurations for development, testing and production environment.
 */
function loadConfig(configName: string = "", env: string = undefined): TAnyObj {
    let appMode: string;
    let config: TAnyObj;

    try {
        // @TODO: find out why process.cwd needed
        appMode =
            env || fs.readFileSync(process.cwd() + '/config/mode', 'utf-8');
    } catch (e) {
        throw new ConfigError('Environment was not set and unable to find /config/mode');
    }

    try {
        let fullConfigName = configName && configName.substr(-1) !== "." ? `${configName}.` : "";

        config = require(`${process.cwd()}/config/${fullConfigName}config.${appMode}.json`);
    } catch (e) {
        console.error(e.message);
        throw new ConfigError(
            `Error processing config file for environment '${appMode}'. Either does not exist or invalid\nRaw error message:${e.message}`
        );
    }

    let result: any = {};
    let base: any = {};

    if (typeof config.extends === 'string') {
        base = loadConfig(configName, config.extends);
    }

    result = extend(base, config);
    // removes json comment
    delete result._comment;
    delete result.extends;

    return result;
}

export {
    getAppConfig,
    loadConfig
};
