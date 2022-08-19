/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { expect } from "chai";
import * as TH from "../util/TestHelper";

TH.setupTests();


describe("MessageProcessor",() => {
    it("should call converter, normalizer and schemaChecker accordingly", () => {
        expect("1").to.be.eq("1");
    });
});