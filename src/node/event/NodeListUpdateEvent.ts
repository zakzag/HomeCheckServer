import TEvent from "../../event/Event";
import ICallback from "../../event/EventCallback";
import {EVENT} from "../../event/EventConstants";
import {IEventReason} from "../../event/EventReason";

class TNodeListUpdateEvent extends TEvent {
    static type: string = EVENT.NODELIST_UPDATE;

    constructor (data: any, reason: Partial<IEventReason> = {}) {
        super(data, reason);
    }
}

type TNodeListUpdateEventCallback = ICallback<TNodeListUpdateEvent>;

export {
    TNodeListUpdateEventCallback,
    TNodeListUpdateEvent,
}