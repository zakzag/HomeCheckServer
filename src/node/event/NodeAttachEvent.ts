import TEvent from "../../event/Event";
import ICallback from "../../event/EventCallback";
import {EVENT} from "../../event/EventConstants";
import {IEventReason} from "../../event/EventReason";

/**
 * Triggered when a new node shows up in the system
 */
class TNodeAttachEvent extends TEvent {
    static type: string = EVENT.NODE_ATTACH;

    constructor (data: any, reason: Partial<IEventReason> = {}) {
        super(data, reason);
    }
}

type TNodeAttachEventCallback = ICallback<TNodeAttachEvent>;

export {
    TNodeAttachEventCallback,
    TNodeAttachEvent,
}