/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {expect} from "chai";
import normailze from "./DefaultNormalizer";

describe("DefaultNormailzer", () => {
    it("should return normalized message", () => {
        const msg = "{ \"meta\": { \"a\":1 }, \"data\": { \"b\":2 } }";

        const normalized = normailze(msg);

        expect(normalized).to.be.deep.equal({
            meta: {a:1},
            data: {b:2}
        });
    });
});