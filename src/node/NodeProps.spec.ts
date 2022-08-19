/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { expect } from "chai";
import TNodeProps, { INodeProps } from "./NodeProps";
import { InvalidNodePropsError } from "../error/ErrorConstants";

describe("TNodeProps", () => {
    /*it("Providing no data should result defaultProps", () => {
        // GIVEN
        // WHEN
        let nodeProps: INodeProps  = new TNodeProps();

        // THEN
        Object.keys(TNodeProps.defaultProps).forEach((key) => {
            expect(nodeProps[key]).to.be.eq(TNodeProps.defaultProps[key]);
        });
        
        expect(Object.keys(nodeProps).length).to.be.equal(7);
    });*/

    it("Passing Normal Object and NodeProps must be equal but different object", () => {
        // GIVEN
        let data: INodeProps = {
            uid: "11:22:33:44",
            name: "testName",
            type: "",
            enabled: true,
            firmwareVersion: "",
            createdAt: 0,
            lastUpdate: 0,
            params: []
        };

        // WHEN
        let nodeProps: INodeProps = new TNodeProps(data);
        let nodeProps2: INodeProps = new TNodeProps(nodeProps);

        // THEN
        expect(nodeProps).to.be.deep.equal(nodeProps2);
        expect(nodeProps).to.be.not.equal(nodeProps2);
    });

    /*it("Passing Normal Object should be stored and mixed with defaultProps", () => {
        // GIVEN
        let data: INodeProps = {
            uid: "12:23:34:45",
            name: "testName",
            type: ""
        };
        let extendedData = extend(TNodeProps.defaultProps, data);

        // WHEN
        let nodeProps: INodeProps  = new TNodeProps(data);

        // THEN
        Object.keys(TNodeProps.defaultProps).forEach((key) => {
            expect(nodeProps[key]).to.be.eq(extendedData[key]);
        });
    });*/

    it("if no object provided as data then InvalidNodePropsError should be thrown", () => {
        // GIVEN
        let data: number = 1;

        // WHEN
        try {
            new TNodeProps(<any>data);
        } catch (e) {
            // THEN
            expect(e instanceof InvalidNodePropsError).to.be.true;
        }
    });

    it("if null provided as data then InvalidNodePropsError should be thrown", () => {
        // GIVEN
        let data: any = null;

        // WHEN
        try {
            new TNodeProps(<any>data);
        } catch (e) {
            // THEN
            expect(e instanceof InvalidNodePropsError).to.be.true;
        }
    });

    it("TNodeProps.create should create the same way as new operator do", () => {
        // GIVEN
        let data: INodeProps = {
            uid: "13:24:35:46",
            name: "testName",
            type: "",
            enabled: true,
            firmwareVersion: "",
            createdAt: 0,
            lastUpdate: 0,
            params: []
        };


        let nodeProps1 = new TNodeProps(data);
        let nodeProps2 = TNodeProps.create(data);

        expect(nodeProps1).to.be.deep.eq(nodeProps2);
    });
});