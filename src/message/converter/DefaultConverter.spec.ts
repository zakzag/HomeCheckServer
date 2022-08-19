/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {expect} from "chai";
import {Buffer} from "buffer";
import convert from "./DefaultConverter";

describe("DefaultConverter", () => {
    it("should convert Buffers", () => {
        const repeats = 10;
        const buffer: Buffer = Buffer.alloc(repeats, 32);

        const result = convert(buffer);

        expect(result).to.be.eq(" ".repeat(repeats))
    });

    it("should convert Strings", () => {
        const buffer: string = "some test";

        const result = convert(buffer);

        expect(result).to.be.eq(buffer);
    });

    it("should throw exception when invalid type is passed", () => {
        const invalidObj = {}

        expect(() => { convert(invalidObj); }).to.throw();
    });
});