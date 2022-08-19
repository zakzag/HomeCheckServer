import TEvent from "../../event/Event";
import ICallback from "../../event/EventCallback";
import {EVENT} from "../../event/EventConstants";
import {IEventReason} from "../../event/EventReason";

class TNodeRemoveEvent extends TEvent {
    static type: string = EVENT.NODE_REMOVE;

    constructor (data: any, reason: Partial<IEventReason> = {}) {
        super(data, reason);
    }
}

type TNodeRemoveEventCallback = ICallback<TNodeRemoveEvent>;

export {
    TNodeRemoveEventCallback,
    TNodeRemoveEvent,
}