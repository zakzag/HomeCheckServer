
import {
    createDependencies,
    initIntegrationTests,
    initTest
} from "../../util/IntegrationTestUtil";
import {IAppConfig, IAppDIConfig} from "../../Application";
import IDBConnection from "../../service/db/DBConnectionInterface";
import {getAppConfig} from "../../util/Config";


describe("Messages",  () => {
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


    it("message gets through the system", () => {

    });
});