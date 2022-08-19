import TEvent from "../../../event/Event";
import ICallback from "../../../event/EventCallback";
import {EVENT} from "../MQTTConstants";

class TBrokerEndEvent extends TEvent {
    static type: string = EVENT.BROKER_END;
}

type TBrokerEndEventCallback = ICallback<TBrokerEndEvent>;

export {
    TBrokerEndEventCallback,
    TBrokerEndEvent

}