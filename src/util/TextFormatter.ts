/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import Color from "./Colors";

/** Prints a header with magenta color */
/* tslint:disable:no-console */
function h1(message: string) {
    console.info(`${Color.FgMagenta}${message}${Color.Reset}`);
}

/** Prints a header2 message with cyan color */
function h2(message: string) {
    console.info(`${Color.FgCyan}${message}${Color.Reset}`);
}

/** Prints a list item message , begins with a cyan *, indented */
function ul(message: string) {
    console.info(`${Color.FgCyan}*${Color.FgWhite} ${message}${Color.Reset}`);
}

/** Prints a information message during a list printing (indented text without * at the beginning) */
function ulInfo(message: string) {
    console.info(`  ${Color.FgGreen}${message}${Color.Reset}`);
}

/** Prints a error message during a list printing (indented text without * at the beginning) */
function ulError(message: string) {
    console.error(`  ${Color.FgRed}${message}${Color.Reset}`);
}

/* tslint:enable:no-console */

export {
    h1, h2, ul, ulInfo, ulError
}