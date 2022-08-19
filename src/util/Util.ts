/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {TAnyObj} from './Types';

type Constructor<T = {}> = new (...args: any[]) => T;

interface IDIConfig {}

function generateUID(): string {
    return [
        dec2hex(random(0, 256)),
        dec2hex(random(0, 256)),
        dec2hex(random(0, 256)),
        dec2hex(random(0, 256))
    ].join(':');
}

function generateRequestID(): string {
    return `${dec2hex(random(0x100000, 0xffffff))}-${dec2hex(
        Date.now().valueOf()
    )}`;
}

function generateDeviceName() {
    return `device-${dec2hex(random(0, 1000000000))}`;
}

function dec2hex(num: number): string {
    let hex: string = num.toString(16);
    if (hex.length === 1) {
        hex = ['0', hex].join('');
    }

    return hex;
}

function random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

function shallowCopy<T>(source: T) {
    return Object.assign({}, source);
}

type TDeepMapCallback = (elem: any, key?: string, obj?: TAnyObj) => any;

/**
 * invokes callback on all properties on an object and its child object recursively
 *
 * @param {TAnyObj} obj
 * @param {Function} callback
 * @returns {any}
 */
function deepMap(obj: TAnyObj, callback: Function) {
    return Object.keys(obj).reduce(function (accumulator, key) {
        if (obj[key] instanceof Object) {
            accumulator[key] = deepMap(obj[key], callback);
        } else {
            accumulator[key] = callback(obj[key], key);
        }
        return accumulator;
    }, {});
}

/**
 * Returns a copy of the parent and extension merged
 *
 * @param parent    Object to extend
 * @param extension New properties as object
 */
function extend<T = TAnyObj>(
    parent: Partial<T>,
    ...extension: Partial<T>[]
): T {
    return <T>Object.assign({}, parent, ...extension);
}

/**
 * Pipe combines n functions. It’s a pipe flowing left-to-right,
 * calling each function with the output of the last one.
 *
 * @param fns functions to call
 */
const pipe = (...fns: Function[]) => (x: any) =>
    fns.reduce((v: any, fn: Function) => fn(v), x);

/**
 * Compose combines n functions. It’s a pipe flowing right-to-left,
 * calling each function with the output of the last one.
 *
 * @param fns functions to call
 */
const compose = (...fns: Function[]) => (x: any) =>
    fns.reduceRight((v: any, fn: Function) => fn(v), x);

export {
    Constructor,
    IDIConfig,
    TDeepMapCallback,
    shallowCopy,
    deepMap,
    generateUID,
    generateRequestID,
    generateDeviceName,
    dec2hex,
    random,
    pipe,
    compose,
    extend,
};
