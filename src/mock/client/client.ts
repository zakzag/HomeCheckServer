
import WebClient from "./WebClient";
let { server: clientConfig, log: logConfig }  = require("./clientConfig.json");
import * as Debug from "../../util/Debug";

Debug.setup(logConfig);

const webClient = new WebClient(clientConfig, {
    connect: undefined,
    connectError: undefined,
    anyEvent: undefined
});

webClient.start();

