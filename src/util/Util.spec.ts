/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import * as Util from './Util';
import { setupTests } from './TestHelper';
import { expect } from 'chai';

setupTests();

describe('DeepMap', () => {
    it('should iterate through items', () => {
        // GIVEN
        let testObj = {
            a: 1,
            b: 2,
            c: {
                d: {
                    e: {
                        f: {
                            a: 32,
                            b: 2
                        }
                    },
                    f: 4,
                    g: {
                        h: 1,
                        i: 2,
                        j: {
                            a: 1
                        }
                    }
                }
            }
        };

        let expectedObj = {
            a: 2,
            b: 3,
            c: {
                d: {
                    e: {
                        f: {
                            a: 33,
                            b: 3
                        }
                    },
                    f: 5,
                    g: {
                        h: 2,
                        i: 3,
                        j: {
                            a: 2
                        }
                    }
                }
            }
        };

        //WHEN

        let resultObj = Util.deepMap(testObj, (elem: any) => {
            return elem + 1;
        });

        expect(resultObj).to.be.deep.equal(expectedObj);
    });
});

describe('Compose', () => {
    it('should call functions after each other', () => {
        let fn1 = (a: number) => a + 2;
        let fn2 = (a: number) => a * 3;
        let result = Util.compose(fn1, fn2)(5);
        expect(result).to.be.equal(17);
    });
});

describe('Pipe', () => {
    it('should call functions after each other', () => {
        let fn1 = (a: number) => a + 2;
        let fn2 = (a: number) => a * 3;
        let result = Util.pipe(fn1, fn2)(5);
        expect(result).to.be.equal(21);
    });
});
