import {CommandMessageDataSchema} from "../../../schema/commandMessage/CommandMessageDataSchema";
import {Record, Static} from "runtypes";


const WebApiCommandMessageDataSchema = Record({
    command: CommandMessageDataSchema
});

type IWebApiCommandMessageData = Static<typeof WebApiCommandMessageDataSchema>;

export {
    IWebApiCommandMessageData,
    WebApiCommandMessageDataSchema
}