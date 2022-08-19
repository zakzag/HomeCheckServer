import TEvent from "../../event/Event";
import ICallback from "../../event/EventCallback";
import {EVENT} from "../../event/EventConstants";
import {IEventReason} from "../../event/EventReason";

class TNodeErrorEvent extends TEvent {
    static type: string = EVENT.NODE_ERROR;

    constructor (data: any, reason: Partial<IEventReason> = {}) {
        super(data, reason);
    }
}

type TNodeEventEventCallback = ICallback<TNodeErrorEvent>;

export {
    TNodeEventEventCallback,
    TNodeErrorEvent,
}