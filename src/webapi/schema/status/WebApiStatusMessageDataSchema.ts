import {WebApiNodeParamsSchema} from "./type/WebApiNodeParamsSchema";
import {WebApiNodeStateSchema} from "./type/WebApiNodeStateSchema";
import {WebApiNodePropsSchema} from "./type/WebApiNodePropsSchema";
import {Static} from "runtypes";
import {WebApiNodeListUpdateDataSchema} from "./type/WebApiNodeListUpdateSchema";
import {WebApiGeneralSchema} from "./type/WebApiGeneralSchema";
import {WebApiNodeFailureSchema} from "./type/WebApiNodeFailureSchema";

/**
 * Data part of ApiStatusMessage, it can be kinds of data:
 * - Node Params change
 * - Node State change
 * - Node Props change
 */
const WebApiStatusMessageDataSchema = WebApiNodeParamsSchema
    .Or(WebApiNodeStateSchema)
    .Or(WebApiNodePropsSchema)
    .Or(WebApiNodeListUpdateDataSchema)
    .Or(WebApiNodeFailureSchema)
    .Or(WebApiGeneralSchema);

type IWebApiStatusMessageData = Static<typeof WebApiStatusMessageDataSchema>;

export {
    IWebApiStatusMessageData,
    WebApiStatusMessageDataSchema,
}