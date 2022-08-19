import TEvent from "../../../event/Event";
import ICallback from "../../../event/EventCallback";
import {EVENT} from "../MQTTConstants";

class TBrokerConnectedEvent extends TEvent {
    static type: string = EVENT.BROKER_CONNECT;
}

type TBrokerConnectedEventCallback = ICallback<TBrokerConnectedEvent>;

export {
    TBrokerConnectedEventCallback,
    TBrokerConnectedEvent
}