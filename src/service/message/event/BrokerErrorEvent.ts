import TEvent from "../../../event/Event";
import ICallback from "../../../event/EventCallback";
import {EVENT} from "../MQTTConstants";

class TBrokerErrorEvent extends TEvent {
    static type: string = EVENT.BROKER_ERROR;
}

type TBrokerErrorEventCallback = ICallback<TBrokerErrorEvent>;

export {
    TBrokerErrorEventCallback,
    TBrokerErrorEvent

}