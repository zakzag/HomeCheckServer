import TEvent from "../../../event/Event";
import ICallback from "../../../event/EventCallback";
import {EVENT} from "../MQTTConstants";

class TBrokerOfflineEvent extends TEvent {
    static type: string = EVENT.BROKER_OFFLINE;
}

type TBrokerOfflineEventCallback = ICallback<TBrokerOfflineEvent>;

export {
    TBrokerOfflineEventCallback,
    TBrokerOfflineEvent

}