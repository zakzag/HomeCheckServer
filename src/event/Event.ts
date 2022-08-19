/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
import EventReason, {EventReasonSource, IEventReason} from "./EventReason";
import {extend} from "../util/Util";

class TEvent {
    /** @static type           Message Type (must be a regsitered type) */
    static type: string = "default";

    /** @field source         Where message is originated from (node) */
    public reason: EventReason;
    /** @field timestamp      When the message originally created (on node). */
    public timestamp?: number = 0;
    public data: any = {};
    public requestId: string = "";
    public uid: string = "";

    constructor(data: any, reason: Partial<IEventReason> = {}) {
        let fullReason: IEventReason = extend({
            timestamp: new Date().valueOf(),
            uid: "",
            errorReason: "",
            errorCode: "",
            requestId: "",
            source: EventReasonSource.Server
        }, reason);

        this.reason = fullReason;
        this.data = data;

        this.timestamp = fullReason.timestamp;
        this.requestId = fullReason.requestId;
        this.uid = fullReason.uid;
    }

    get type() {
        return (this.constructor as any).type;
    }
}

export default TEvent;