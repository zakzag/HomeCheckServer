import TEvent from "../../event/Event";
import ICallback from "../../event/EventCallback";
import {EVENT} from "../../event/EventConstants";
import {IEventReason} from "../../event/EventReason";

class TNodePropsChangeEvent extends TEvent {
    static type: string = EVENT.NODE_PROPS_UPDATE;

    constructor (data: any, reason: Partial<IEventReason> = {}) {
        super(data, reason);
    }
}

type TNodePropsChangeEventCallback = ICallback<TNodePropsChangeEvent>;

export {
    TNodePropsChangeEventCallback,
    TNodePropsChangeEvent,
}