import {WebApiStatusMessageSchema} from "./status/WebApiStatusMessageSchema";
import {WebApiCommandMessageSchema} from "./command/WebApiCommandMessageSchema";
import {Static} from "runtypes/lib/runtype";

const WebApiMessageSchema = WebApiStatusMessageSchema.Or(WebApiCommandMessageSchema);

type IWebApiMessage = Static<typeof WebApiMessageSchema>;

export {
    WebApiMessageSchema,
    IWebApiMessage
}