import TEvent from "../../event/Event";
import ICallback from "../../event/EventCallback";
import {EVENT} from "../../event/EventConstants";
import {IEventReason} from "../../event/EventReason";

class TNodeParamsChangeEvent extends TEvent {
    static type: string = EVENT.NODE_PARAMS_UPDATE;

    constructor (data: any, reason: Partial<IEventReason> = {}) {
        super(data, reason);
    }
}

type TNodeParamsChangeEventCallback = ICallback<TNodeParamsChangeEvent>;

export {
    TNodeParamsChangeEventCallback,
    TNodeParamsChangeEvent,
}