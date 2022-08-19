import TEvent from "../../event/Event";
import ICallback from "../../event/EventCallback";
import {EVENT} from "../../event/EventConstants";
import {IEventReason} from "../../event/EventReason";

class TNodeFailureEvent extends TEvent {
    static type: string = EVENT.NODE_FAILURE;

    constructor (data: any, reason: Partial<IEventReason> = {}) {
        super(data, reason);
    }
}

type TNodeFailureEventCallback = ICallback<TNodeFailureEvent>;

export {
    TNodeFailureEventCallback,
    TNodeFailureEvent,
}