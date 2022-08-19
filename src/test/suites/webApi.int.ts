import {getAppConfig} from "../../util/Config";
import {
    initDb,
    initIntegrationTests,
    createDependencies,
    mockMessageBroker,
    printSeparator,
    runApplication, wait
} from "../../util/IntegrationTestUtil";
import {IAppConfig, IAppDIConfig} from "../../Application";
import IDBConnection from "../../service/db/DBConnectionInterface";
import {publishDeviceInfoMessage} from "../commands";
import {IWebApi} from "../../webapi/WebApiInterface";
import WebClient from "../../mock/client/WebClient";
import * as Debug from "../../util/Debug";
import IMessageBroker from "../../service/message/MessageBrokerInterface";
import {expect} from 'chai';
import * as chai from 'chai';

describe.skip("WebApi",  () => {
    let diConfig: IAppDIConfig;
    let conn: IDBConnection;
    let appConfig: IAppConfig;
    let webApi: IWebApi;
    let webClient: WebClient;
    let messageBroker: IMessageBroker;

    webApi;

    before(() => {
        initIntegrationTests();
        appConfig = getAppConfig("integration");
        Debug.setup(appConfig.log);
    });

    beforeEach(async () => {
        printSeparator();

        diConfig = await createDependencies(appConfig);

        conn = diConfig.dbService.Connection;
        webApi = diConfig.webApi;
        messageBroker = diConfig.messageBroker;

        webClient = new WebClient(appConfig.client);
        webClient.start();

        webClient.setOnAnyEvent((event, ...args) => {
            console.info("event", event, ...args);
        });

        mockMessageBroker(messageBroker);
        await initDb(diConfig.dbService, appConfig.db);
        await runApplication(diConfig);
    });

    afterEach(async () => {
        /* if not called all the methods, it would cause weird behavior, as any of them would have some remaining
         * internal state, which causes not independent tests */
        await conn.disconnect();
        await messageBroker.end();
        await webApi.stop();
        await webClient.stop();
    });

    it("should send message when device triggered an info message", async () => {
        chai.spy.on(webClient, ["onAnyEvent"], webClient.onAnyEvent);

        console.info(webClient.onAnyEvent.toString());
        publishDeviceInfoMessage(messageBroker, "12:13:14:15", "1111-2233-444444444444");

        await wait(100);
        expect(webClient.setOnAnyEvent).to.be.called();
    });

    /* uzenetek ellenorzese, amikor:
     * - uj node jelenik meg
     * - info message eseten uj node, ha az uid uj
     * - info message eseten props update ha az id nem uj
     * - node torles
     * - props change
     * - state change (hibak?)
     * - params change
     * - failure
     * - nincs uzenet, ha valamikor hibas message erkezik a devicetol

     * tovabbi esetek:
     * - ha hibas message jon, akkor azt valahol kezelni kell, megtortenik?
     *
     * */
});