import { io } from "socket.io-client";
import {TAnyObj} from "../../util/Types";
import {Socket} from "socket.io-client";
import * as Debug from "../../util/Debug";

/**
 * starts the client by initializing connection using config
 */
interface IWebClientCallbacks {
    connect?: Function | undefined | null,
    connectError?: Function | undefined | null,
    anyEvent?: Function | undefined | null
}

interface IWebClientConfig {
    url: string,
    port: number,
    reconnectionDelay: number,
    reconnectionAttempts: number;
    homeID: string;
}

class WebClient {
    constructor(private clientConfig: TAnyObj, private callbacks: IWebClientCallbacks = { }) { }
    private socket: Socket;

    public start() {
        Debug.info(`Starting web client to host ${this.clientConfig.url}:${this.clientConfig.port}, path: /${this.clientConfig.homeID}/`);

        this.socket = io(`${this.clientConfig.url}:${this.clientConfig.port}`, {
            reconnectionDelayMax: this.clientConfig.reconnectionDelay,
            path: `/${this.clientConfig.homeID}/`,
            reconnectionAttempts: this.clientConfig.reconnectionAttempts
        });

        this.socket.on("connect", this.onConnect.bind(this));
        this.socket.on("connect_error", this.onConnectError.bind(this));
        this.socket.onAny(this.onAnyEvent.bind(this));
    }

    public stop() {
        this.socket.disconnect();
    }

    public setOnConnect(callback: Function) {
        this.callbacks.connect = callback;
    }

    public setOnConnectError(callback: Function) {
        this.callbacks.connectError = callback;
    }

    public setOnAnyEvent(callback: Function) {
        this.callbacks.anyEvent = callback;
    }

    public onConnect(...args) {
        this.callbacks.connect && this.callbacks.connect(...args);
        console.info("Client has been started, listening to messages");
    }

    public onConnectError(error) {
        this.callbacks.connectError && this.callbacks.connectError(error);
        console.error("Can't connect");
    }

    public onAnyEvent(event, ...args) {
        this.callbacks?.anyEvent && this.callbacks.anyEvent(event, ...args);
        console.info(`got ${event} `, ...args);

    }
}

export default WebClient;

export {
    IWebClientCallbacks,
    IWebClientConfig,
}