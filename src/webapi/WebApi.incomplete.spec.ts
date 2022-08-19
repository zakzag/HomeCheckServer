import TWebApi from "./WebApi";
import {IWebApi} from "./WebApiInterface";

import {expect} from "chai";
import {spy, fake, replace} from "sinon"
import {EVENT} from "../event/EventConstants";
import {API_MESSAGE, API_NODE_ACTION} from "./WebApiConstants";
import INode from "../node/NodeInterface";
import TDeviceNode from "../device/DeviceNode";


describe("WebApi", () => {
    let socketIoServer;
    let nodeManager;
    let webApi: IWebApi;

    const mockNode = {
        props: {}
    };

    function doMockWebApi() {
        replace(webApi, "broadcastMessage", spy());
        replace(webApi, "addDevice", spy());
        replace(webApi, "removeDevice", spy());
    }

    function createMockMsg(action) {
        return {
            meta: {uid: 'mockUid', requestId: 'mockRequestId'},
            data: {nodeAction: action}
        }
    }

    function createMockEvent() {
        return {
            requestId: "mockRequestId",
            uid: "mockUid"
        }
    }

    /* [  ] */

    beforeEach(() => {
        nodeManager = {
            items: {},
            findNode: () => {
                return mockNode;
            },
            nodeList: [],
            on: (name: string, fn) => {
                nodeManager.items[name] = fn;
            },
            off: spy(),
            trigger: (name: string, data: any) => {
                nodeManager.items[name](data);
            }
        }

        socketIoServer = {
            on: spy(),
            emit: spy(),
            close: spy(),
            disconnectSockets: spy(),
            sockets: {
                sockets: {
                    forEach: spy()
                }
            }
        }

        replace(nodeManager, "on", fake(nodeManager.on));
        replace(nodeManager, "findNode", fake(nodeManager.findNode));

        webApi = (new TWebApi()).inject({
            server: socketIoServer,
            nodeManager
        });
    });

    it("should create webApi", () => {
        expect(webApi).to.exist;
    });

    it("should nodemanager.on and server.on called", () => {
        webApi.run();

        expect(nodeManager.on.calledThrice).to.be.true;
        expect(nodeManager.on.firstCall.calledWith(EVENT.NODE_ATTACH)).to.be.true;
        expect(nodeManager.on.secondCall.calledWith(EVENT.NODE_REMOVE)).to.be.true;
        expect(nodeManager.on.thirdCall.calledWith(EVENT.NODELIST_UPDATE)).to.be.true;

        expect(socketIoServer.on.calledOnce).to.be.true;
        expect(socketIoServer.emit.calledOnce).to.be.true;
        expect(socketIoServer.emit.firstCall.calledWith(API_MESSAGE.SERVER_START)).to.be.true
    });

    it("broadcastAppStart emits event", () => {
        webApi.broadcastAppStart();

        expect(socketIoServer.emit.firstCall.calledWith(API_MESSAGE.SERVER_START, {}));
    });

    it("broadcastAppStop emits event", () => {
        webApi.broadcastAppStop();

        expect(socketIoServer.emit.firstCall.calledWith(API_MESSAGE.SERVER_STOP, {}));
    });

    describe("NodeManager Events", () => {
        it("webapi should trigger nodeAttach when nodemanager sends event", () => {
            const mockMsg = createMockMsg(API_NODE_ACTION.ADD);
            doMockWebApi();

            webApi.run();
            nodeManager.trigger(EVENT.NODE_ATTACH, createMockEvent());

            expect((webApi.addDevice as spy).calledOnce).to.be.true;
            expect((webApi.addDevice as spy).firstCall.calledWith(mockNode)).to.be.true;

            expect((webApi.broadcastMessage as spy).calledTwice).to.be.true;
            expect((webApi.broadcastMessage as spy).secondCall.calledWith(API_MESSAGE.NODE_ATTACH, mockMsg)).to.be.true;
        });

        it("webapi should trigger nodeRemove when nodemanager sends event", () => {
            const mockMsg = createMockMsg(API_NODE_ACTION.REMOVE);
            doMockWebApi();

            webApi.run();
            nodeManager.trigger(EVENT.NODE_REMOVE, createMockEvent());

            expect((webApi.removeDevice as spy).calledOnce).to.be.true;
            expect((webApi.removeDevice as spy).firstCall.calledWith(mockNode)).to.be.true;

            expect((webApi.broadcastMessage as spy).calledTwice).to.be.true;
            expect((webApi.broadcastMessage as spy).secondCall.calledWith(API_MESSAGE.NODE_REMOVE, mockMsg)).to.be.true;
        });

        it("webapi should trigger nodelist update when nodemanager sends event", () => {
            const mockMsg = createMockMsg(API_NODE_ACTION.NODELIST_UPDATE);
            doMockWebApi();

            webApi.run();
            nodeManager.trigger(EVENT.NODELIST_UPDATE, createMockEvent());

            expect((webApi.broadcastMessage as spy).calledTwice).to.be.true;
            expect((webApi.broadcastMessage as spy)
                .secondCall.calledWith(API_MESSAGE.NODELIST_UPDATE, mockMsg)).to.be.true;
        });
    });

    it("should bind new events to attached node", () => {
        let node = {
            on: spy()
        }

        webApi.addDevice(node as INode);

        expect(node.on.callCount).to.be.equal(5);
        expect(node.on.getCall(0).calledWith(EVENT.NODE_FAILURE)).to.be.true;
        expect(node.on.getCall(1).calledWith(EVENT.NODE_ERROR)).to.be.true;
        expect(node.on.getCall(2).calledWith(EVENT.NODE_PARAMS_UPDATE)).to.be.true;
        expect(node.on.getCall(3).calledWith(EVENT.NODE_PROPS_UPDATE)).to.be.true;
        expect(node.on.getCall(4).calledWith(EVENT.NODE_STATE_UPDATE)).to.be.true;
    });

    it("should remove events when removeNode is called", () => {
        let node = {
            off: spy()
        }

        webApi.removeDevice(node as INode);

        expect(node.off.callCount).to.be.equal(5);
        expect(node.off.getCall(0).calledWith(EVENT.NODE_FAILURE)).to.be.true;
        expect(node.off.getCall(1).calledWith(EVENT.NODE_ERROR)).to.be.true;
        expect(node.off.getCall(2).calledWith(EVENT.NODE_PARAMS_UPDATE)).to.be.true;
        expect(node.off.getCall(3).calledWith(EVENT.NODE_PROPS_UPDATE)).to.be.true;
        expect(node.off.getCall(4).calledWith(EVENT.NODE_STATE_UPDATE)).to.be.true;
    });

    describe("Node Events", () => {
        it("should trigger events when node sends events", () => {
            const node: INode = new TDeviceNode();

            node
        });
    });

// trigger nodemanager actions, check whether events are triggered or not
    /*

       UIManagert mockolni

       hozzaadunk uj mockolt node-ot, megnezni ha
         - a node-on triggerelunk esemenyeket, akkor a mockolt socket-en is meghivodik-e a megfelelo esemeny
           props,params,state change, failure,


       integration test:
       - toroljuk az adatbazist,
       - mockup klienssel kapcsolodunk
       - nem letezo device id-vel elkuldunk egy info message-t
       - megnezzuk, hogy a megfelelo esemenyek meghivodnak-e a kliensen a megfelelo adatokkal
       - use case-ek:
          - uj device info eseten a node attach event
          - uj device eseten az ujabb info mar props  update lesz
          - uj device eseten az ujabb info mar params update lesz, ha van params csere
          - nem letezo device eseten nincs triggerelt esemeny a kliensen
          - uj device eseten az info utan bejovo state nodestatechange esemenyt general
          - hiba kuldese eseten hibaesemeny lesz, de csak ha a regi kod nem ugyanaz mint az uj es az uj hibakod  hiba
    */
});