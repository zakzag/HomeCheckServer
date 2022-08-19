/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {Record, Number, Boolean, Array, Static} from "runtypes";


const TWateringStationSensorParams = Record({
    /** whether this unit is switched on or not */
    active: Boolean,
    /** the level of  humidity, it triggers watering (0-1023) */
    minHumidityLevel: Number,
    /** the level of humidity, it triggers sending warning (0-1023) */
    maxHumidityLevel: Number,
    /** delay of watering after humidity reached minimum (secs) */
    triggerDelay: Number,
});

const TWateringStationParams = Record({
    /** time between measurements */
    checkInterval: Number,
    /** the minimum time of watering even if some calculation says otherwise (secs) */
    minWaterDuration: Number,
    /** maximum time of watering even if some calculation says otherwise (secs) */
    maxWateringDuration: Number,
    /** separate units of sensor/tube */

    sensors: Array(TWateringStationSensorParams)
});


type IWateringStationParams = Static<typeof TWateringStationParams>;

export default TWateringStationParams;

export {
    TWateringStationParams,
    IWateringStationParams
}