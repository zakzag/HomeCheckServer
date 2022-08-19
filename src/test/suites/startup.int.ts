
import {
    createDependencies,
    initIntegrationTests,
    initTest
} from "../../util/IntegrationTestUtil";
import {expect} from 'chai';
import {IAppConfig, IAppDIConfig} from "../../Application";
import IDBConnection from "../../service/db/DBConnectionInterface";
import {getAppConfig} from "../../util/Config";
import TNodeManager from "../../node/NodeManager";

describe("Server Startup",  () => {
    let diConfig: IAppDIConfig;
    let conn: IDBConnection;
    let appConfig: IAppConfig;

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
});