/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

/**
 *
 */
type TWebApiResponse = any;

/**
 *
 */
type TWebApiAction = (data: any) => TWebApiResponse;

/**
 *
 */
type TWebActionList = Map<string, TWebApiAction>;

export {
    TWebApiResponse,
    TWebApiAction,
    TWebActionList
}