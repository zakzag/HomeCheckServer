/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/


import { expect } from "chai";
import TBaseMockDevice from "../mock/device/Base";
import {STATUS} from "../node/NodeConstants";
import {
    ICommandMessage,
    IInfoForResponse,
    IParamList,
    IResponseMessage,
    IStatusForResponse,
    TParamObject
} from "../schema/schemas";
import {
    composeCommandMessage,
    composeStateResponse} from "./MessageComposer";
import {convertObjectToParamList, convertParamListToObject} from "../util/ParamUtils";


function createDevice(): TBaseMockDevice {
    return new TBaseMockDevice({
        uid: "testUID",
        name: "testName",
        type: "testType",
        firmwareVersion: "0.1.0",
        params: [],
        status: STATUS.WORK
    }, {
        status: {
            errorCode: "0",
            errorReason: "",
            status: STATUS.WORK,
            busy: false,
        },
        traits: []
    });
}

describe("MessageComposer", () => {
    describe("composeStatusResponse", () => {
        it("should create a new Status response message", () => {
            // GIVEN
            const device = createDevice();

            // WHEN 
            let msg: IResponseMessage = composeStateResponse(device);

            // THEN
            const rid = msg.meta.requestId;
            expect(rid).to.be.string;
            expect(rid.length).to.be.above(10);

            for (let i = 0; i < rid.length; i++) {
                let charCode = rid.charCodeAt(i);
                expect(charCode).to.be.greaterThan(44); // "-" -1
                expect(charCode).to.be.lessThan(122); // Z
            }

            expect(msg.meta.uid).to.be.equal(device.props.uid);
            expect((msg.data as IStatusForResponse).status).to.be.deep.equal(device.state.status);

            expect((msg.data as IStatusForResponse).traits).to.be.deep.equal(device.state.traits);
            expect((msg.data as IInfoForResponse).info).to.be.undefined;

            //expect(MessageSchema.check.bind(null, msg)).to.throw();
        });
    });

    describe("composeCommandMessage", () => {
        it("should create proper command message", () => {
            // GIVEN
            const command: string = "delta";
            const params = {
                param1: "1",
                param2: 2
            };

            const convertedParams: Array<any> = [
                {
                    name: "param1",
                    value: String(params.param1)
                }, {
                    name: "param2",
                    value: String(params.param2)
                }
            ]

            // WHEN 
            let msg: ICommandMessage = composeCommandMessage(command, params);

            // THEN
            expect(msg.meta.requestId.length).to.be.string;
            expect(msg.meta.requestId.length).to.be.greaterThan(10);
            expect(msg.data.command).to.be.equal(command);
            expect(msg.data.params).to.be.deep.equal(convertedParams);
        })
    });

    describe("convertParamListToObject", () => {
        it("should convert params properly", () => {
            let paramList: IParamList = [{
                name: "param1",
                value: "value1"
            }, {
                name: "param2",
                value: "value2"
            }];

            let result: TParamObject = convertParamListToObject(paramList);

            expect(result).to.be.deep.equal({
                [paramList[0].name]: paramList[0].value,
                [paramList[1].name]: paramList[1].value,
            });
        });
    });

    describe("convertObjectToParamList", () => {
        it("should convert object properly", () => {
            let paramList: TParamObject = {
                "param1": "value1",
                "param2": 2,
                "param3": true
            };

            let result: IParamList = convertObjectToParamList(paramList);

            expect(result).to.be.deep.equal([{
                name: "param1",
                value: String(paramList.param1)
            }, {
                name: "param2",
                value: String("2")
            }, {
                name: "param3",
                value: String("true")
            }]);
        });
    });
});

