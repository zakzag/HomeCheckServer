/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Record, Static} from 'runtypes';
import { InfoSchema } from '../InfoSchema';
import { StatusSchema } from '../StatusSchema';
import { TraitValuesSchema } from '../trait/TraitValuesSchema';


/**
 * Response schema can be:
 * * info response
 * * status response
 * The list will expand with commandresponse, acknowledge responses
 * @TODO: add more
 */
const InfoForResponseSchema = Record({ info: InfoSchema });

const StatusForResponseSchema = Record({
    status: StatusSchema,
    traits: TraitValuesSchema,
});


const ResponseMessageDataSchema = InfoForResponseSchema.Or(StatusForResponseSchema);

type IResponseMessageData = Static<typeof ResponseMessageDataSchema>;
type IInfoForResponse = Static<typeof InfoForResponseSchema>;
type IStatusForResponse = Static<typeof StatusForResponseSchema>

export {
    ResponseMessageDataSchema,
    IResponseMessageData,
    IInfoForResponse,
    IStatusForResponse
}