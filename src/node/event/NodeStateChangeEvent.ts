import TEvent from "../../event/Event";
import ICallback from "../../event/EventCallback";
import {EVENT} from "../../event/EventConstants";
import {IEventReason} from "../../event/EventReason";

class TNodeStateChangeEvent extends TEvent {
    static type: string = EVENT.NODE_STATE_UPDATE;

    constructor (data: any, reason: Partial<IEventReason> = {}) {
        super(data, reason);
    }
}

type TNodeStateChangeEventCallback = ICallback<TNodeStateChangeEvent>;

export {
    TNodeStateChangeEventCallback,
    TNodeStateChangeEvent,
}