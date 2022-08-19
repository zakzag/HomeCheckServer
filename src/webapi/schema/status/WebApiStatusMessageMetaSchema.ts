import {Record, String} from "runtypes";
import {Static} from "runtypes/lib/runtype";


const WebApiStatusMessageMetaSchema = Record({
    uid: String,
    requestId: String
});

type IWebApiStatusMessageMeta = Static<typeof WebApiStatusMessageMetaSchema>;

export {
    WebApiStatusMessageMetaSchema,
    IWebApiStatusMessageMeta
}