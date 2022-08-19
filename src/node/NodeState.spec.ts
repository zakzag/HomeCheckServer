/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/


import { expect } from "chai";
import TNodeState, { INodeState } from "./NodeState";
import { extend } from "../util/Util";

describe("TNodeState", () => {
    beforeEach(() => {
    });

    it("Providing no data should result empty timestamp", () => {
        // GIVEN
        // WHEN
        let nodeState: INodeState = new TNodeState();

        // THEN
        Object.keys(TNodeState.defaultState).forEach((key) => {
            expect(nodeState[key]).to.be.eq(TNodeState.defaultState[key]);
        });
        expect(Object.keys(nodeState).length).to.be.equal(3);
    });

    it("Passing Normal Object and NodeState must be equal but different object", () => {
        // GIVEN
        let data = {
            massacre: 1,
            timestamp: new Date("1976-11-03").valueOf()
        };

        // WHEN
        const nodeState: INodeState = TNodeState.create(data);
        const nodeState2: INodeState = new TNodeState(nodeState);

        // THEN
        expect(nodeState).to.be.deep.equal(nodeState2);
        expect(nodeState).to.be.not.equal(nodeState2);
    });

    it("Passing Normal Object should be stored", () => {
        // GIVEN
        const data = {
            timestamp: new Date("1976-11-03").valueOf()
        };

        const extendedData = extend(TNodeState.defaultState, data);

        // WHEN
        const nodeState: INodeState = TNodeState.create(data);

        // THEN
        Object.keys(extendedData).forEach((key) => {
            expect(nodeState[key]).to.be.eq(extendedData[key]);
        });
    });

    it("if no object provided as data then InvalidNodeStateError should be thrown", () => {
        // GIVEN
        const data: number = 1;

        // WHEN
        try {
            new TNodeState(<any>data);
        } catch(e) {
            // THEN
            expect(e.name).to.be.equal("InvalidNodeStateError");
        }
    });

    it("if null provided as data then InvalidNodeStateError should be thrown", () => {
        // GIVEN
        const data: any = null;

        // WHEN
        try {
            new TNodeState(<any>data);
        } catch(e) {
            // THEN
            expect(e.name).to.be.equal("InvalidNodeStateError");
        }
    });

    it("TNodeState.create should create the same way as new operator do", () => {
        // GIVEN
        const data = {
            massacre: 1,
            test: 2,
            timestamp: new Date("1976-11-03").valueOf()
        };
        const xdata: INodeState = <INodeState>extend(TNodeState.defaultState, data)

        let nodeState1 = new TNodeState(xdata);
        let nodeState2 = TNodeState.create(data);

        expect(nodeState1).to.be.deep.eq(nodeState2);
    });
});