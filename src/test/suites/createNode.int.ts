
import {
    wait,
    createDependencies,
    initIntegrationTests,
    initTest
} from "../../util/IntegrationTestUtil";
import {expect} from 'chai';
import {IAppConfig, IAppDIConfig} from "../../Application";
import {IResponseMessage} from "../../schema/responseMessage/ResponseMessageSchema";
import IDBConnection from "../../service/db/DBConnectionInterface";
import {publishDeviceInfoMessage} from "../commands";
import {getAppConfig} from "../../util/Config";
import {INodeProps} from "../../node/NodeProps";
import {INodeState} from "../../node/NodeState";
import {IInfoForResponse} from "../../schema/schemas";
import {STATUS} from "../../node/NodeConstants";
import TNodeManager from "../../node/NodeManager";

describe("Create Node",  () => {
    let diConfig: IAppDIConfig;
    let conn: IDBConnection;
    let appConfig: IAppConfig;
    const uid: string = "12:23:43:44";

    before(() => {
        initIntegrationTests();
    });

    beforeEach(async () => {
        appConfig = getAppConfig("integration");
        diConfig = await createDependencies(appConfig);
        conn = diConfig.dbService.Connection;

        await initTest(diConfig, appConfig);
    });

    afterEach(async () => {
        await conn.disconnect();
        await diConfig.messageBroker.end();
        await diConfig.webApi.stop();
    });

    /** This test will check whether application subscribes itself to get all status
     * infos from all devices on startup */
    it("should subscribe to info responses for all devices", async () => {
        const mqtt = diConfig.messageBroker;
        expect(mqtt.subscribe).to.be.called.exactly(1).with("+/status/info");
    });

    /**
     * It checks whether all the devices were restored from database on startup */
    it("", ()=> {
        let nodeMgr: TNodeManager = diConfig.nodeManager;

        console.info(`SIZE: ${nodeMgr.nodeList.size}`);
    });

    /** When a new node shows up, the application will send an info message,
     * and when it happens, application should save its data to the database by
     * creating a new entry in nodeList table and create a new table derived from
     * its uid */
    it("should save node PROPS and STATE when new node shows up", async () => {
        // GIVEN
        const mqtt = diConfig.messageBroker;

        // WHEN
        const infoMsg: IResponseMessage = publishDeviceInfoMessage(mqtt);
        const infoMsgInfo = (infoMsg.data as IInfoForResponse).info;
        await wait(100);

        // THEN
        const dbList = (await conn.getTableList());

        const props: INodeProps = await diConfig.dbService.Node.loadProps(uid);
        const states: INodeState[] = await diConfig.dbService.Node.loadStates(uid, {}, 10,0);
        const state = states[0];

        // PROPS check
        expect(props.uid).to.be.equal(infoMsg.meta.uid);
        expect(props.uid).to.be.equal(infoMsgInfo.uid);
        expect(props.createdAt).to.be.a('number').greaterThan(1635016107321);

        expect(props.enabled).to.be.true;
        expect(props.lastUpdate).to.be.a('number').greaterThan(1635016107321);
        expect(props.name).to.be.equal(infoMsgInfo.name);
        expect(props.type).to.be.equal(infoMsgInfo.type);
        expect(props.params).to.be.deep.equal(infoMsgInfo.params);

        // STATE check (should contain default values)
        expect(states.length).to.be.equal(1);
        expect(state.timestamp).to.be.a('number').greaterThan(1635017012581);
        expect(state.status.errorCode).to.be.equal("0");
        expect(state.status.errorReason).to.be.equal("");
        expect(state.status.status).to.be.equal(STATUS.WORK);
        expect(state.traits).to.be.a('array');
        expect(state.traits.length).to.be.eq(0);

        // there must be only 2 tables: node list table and the one for the node just created
        expect(dbList.length).to.be.equal(2);
        // node list table must exist
        expect(dbList.includes("nodeList")).to.be.true;
        // node table must exist
        expect(dbList.includes("node-12234344")).to.be.true;
    });

    /** When a new device shows up, a new DeviceNode of its type will be created and this DeviceNode
     * will subscribe to some device specific topics */
    it("should subscribe to status responses when a new node shows up", async () => {
        // GIVEN
        const mqtt = diConfig.messageBroker;

        // WHEN
        publishDeviceInfoMessage(mqtt);

        await wait(100);

        expect(mqtt.subscribe).to.be.called.exactly(5)
            .with(`${uid}/status/online`)
            .with(`${uid}/status/offline`)
            .with(`${uid}/status/state`)
            .with(`${uid}/status/info`)
    });

    /** Use Cases to be tested */
    /* application should save all status messages from different devices */
    /* error should throw when the existing and the info message have unresolvable differences like
        - type is different
        - firmware is older in the message
        - param keys are different
     */
    /* error should be occurred when invalid response arrives for
        - status
        - info
     */
});