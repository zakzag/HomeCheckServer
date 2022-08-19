import TEvent from "../../event/Event";
import ICallback from "../../event/EventCallback";
import {EVENT} from "../../event/EventConstants";
import {IEventReason} from "../../event/EventReason";

class TNodeStateReceiveEvent extends TEvent {
    static type: string = EVENT.NODE_STATE_RECEIVE;

    constructor (data: any, reason: Partial<IEventReason> = {}) {
        super(data, reason);
    }
}

type TNodeStateReceiveCallback = ICallback<TNodeStateReceiveEvent>;

export {
    TNodeStateReceiveCallback,
    TNodeStateReceiveEvent,
}