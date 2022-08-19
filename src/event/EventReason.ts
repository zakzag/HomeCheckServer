
enum EventReasonSource {
    Server = "Server",
    Device = "Device",
    Client = "Client"
}
/**
 * Data class, which stores of a source/reason of an event
 *
 */
interface IEventReason {
    requestId?: string;
    uid?: string;
    source: EventReasonSource;
    timestamp: number;
    errorCode?: string;
    errorReason?: string;
}

class EventReason implements IEventReason {
    requestId?: string = "";
    uid?: string = "";
    source: EventReasonSource = EventReasonSource.Server;
    timestamp: number = new Date().valueOf();
    errorCode?: string = "";
    errorReason?: string = "";
    // history which list prev states of reason
}

export default EventReason;

export {
    EventReasonSource,
    IEventReason
}