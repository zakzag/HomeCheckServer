import TEvent from "../../event/Event";
import ICallback from "../../event/EventCallback";
import {EVENT} from "../../event/EventConstants";
import {IEventReason} from "../../event/EventReason";

class TNodeInfoReceiveEvent extends TEvent {
    static type: string = EVENT.NODE_INFO_RECEIVE;

    constructor (data: any, reason: Partial<IEventReason> = {}) {
        super(data, reason);
    }
}

type TNodeInfoReceiveCallback = ICallback<TNodeInfoReceiveEvent>;

export {
    TNodeInfoReceiveCallback,
    TNodeInfoReceiveEvent,
}