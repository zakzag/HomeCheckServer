import {IParam, IParamList} from "../schema/ParamSchema";
import {gotParamsFailure, hasParamsChanged} from "./ParamUtils";
import {expect} from "chai";

describe("Param Utils", () => {
    const param1: IParam = {
        name: "param1",
        value: "value1"
    }

    const param2: IParam = {
        name: "param2",
        value: "value2"
    }

    const param3: IParam = {
        name: "param3",
        value: "value3"
    }

    const param2Modified: IParam = {
        name: "param2",
        value: "value2mod"
    }

    const paramList1: IParamList = [param1, param2];
    const paramList2: IParamList = [param1, param2, param3];
    const paramList3: IParamList = [param1, param2Modified, param3];
    const paramList4: IParamList = [param1, param2Modified];


    beforeEach(() => {

    });

    describe("convertParamListToObject", () => {

    });

    describe("gotParamsFailure", () => {
        it("should return false when params are matching", () => {
            expect(gotParamsFailure(paramList1, paramList1)).to.be.false;
        });

        it("should return true when no. of params no not match but params do", () => {
            expect(gotParamsFailure(paramList1, paramList2)).to.be.true;
        });

        it("should return true when no of params do not match", () => {
            expect(gotParamsFailure(paramList3, paramList4)).to.be.true;
        });

        it("should return false when no of params do match but actual params do not", () => {
            expect(gotParamsFailure(paramList2, paramList3)).to.be.false;
        });
    });

    describe("hasParamsChanged", () => {
        it("should return false when no params changed", () => {
            expect(hasParamsChanged(paramList1, paramList1)).to.be.false;
        });

        it("should return true when params has changed", () => {
            expect(hasParamsChanged(paramList2, paramList3)).to.be.true;
        });


        it("should return true when params has changed and mismatch", () => {
            expect(hasParamsChanged(paramList1, paramList3)).to.be.true;
        });

        it("should return true when params mismatch", () => {
            expect(hasParamsChanged(paramList3, paramList4)).to.be.true;
        });
    });

    describe("convertParamListToObject", () => {

    });

});