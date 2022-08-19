import {expect} from "chai";
import {composeWebApiStatusMessage} from "./WebApiMessageComposer";
import {IWebApiStatusMessageData} from "./schema/status/WebApiStatusMessageDataSchema";


describe("WebApiMessageComposer", () => {
    describe("createWebApiStatusMessage", () => {
        it("should create a new message", () => {
            const uid: string  = "uid-123123";
            const requestId: string = "rid-12312322312";
            const data: IWebApiStatusMessageData = {
                params: [{
                    name: "1",
                    value: "2"
                }]
            };

            const expectedMsg = {
                "meta": {
                    uid,
                    requestId
                },
                data
            }

            const msg = composeWebApiStatusMessage(requestId, uid, data);

            expect(msg).to.be.deep.equal(expectedMsg);
        });

        it("should throw error when wrong data is given", () => {
            const uid: string  = "uid-123123";
            const requestId: string = "rid-12312322312";
            const data = {
                params: [{
                    name: "1",
                    value: "2"
                }]
            };

            //console.info(JSON.stringify(composeWebApiStatusMessage(requestId, uid, data as any)));
            expect(() => composeWebApiStatusMessage(requestId, uid, data as any)).to.not.throw;


        });

        it ("should throw error when uid  is not set", () => {
            const uid: string  = undefined;
            const requestId: string = "12312322312";
            const data: IWebApiStatusMessageData = {
                params: [{
                    name: "1",
                    value: "2"
                }]
            };



            expect(() => composeWebApiStatusMessage(requestId, uid, data)).to.throw(Error);
        });

        it ("should generate request id if not passed", () => {
            const uid: string  = "123123";
            const requestId: string = undefined;
            const data: IWebApiStatusMessageData = {
                params: [{
                    name: "1",
                    value: "2"
                }]
            };

            const msg = composeWebApiStatusMessage(requestId, uid, data);

            expect(msg.meta.requestId).to.match(/\w{6}-\w{11}/);
        });
    });
});