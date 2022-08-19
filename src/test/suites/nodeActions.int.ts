/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {getAppConfig} from "../../util/Config";
import {
    initIntegrationTests,
    createDependencies,
    wait,
    initTest
} from "../../util/IntegrationTestUtil";
import IDBConnection from "../../service/db/DBConnectionInterface";
import {Application, IAppConfig, IAppDIConfig} from "../../Application";
import {defaultMockTraits, defaultStatus, publishDeviceInfoMessage, publishDeviceStatusMessage} from "../commands";
import IMessageBroker from "../../service/message/MessageBrokerInterface";
import {ITraitValues} from "../../schema/trait/TraitValuesSchema";
import {expect} from 'chai';
import {STATUS} from "../../node/NodeConstants";
import {INodeStatus} from "../../schema/StatusSchema";


describe("Node",  () => {
    let diConfig: IAppDIConfig;
    let conn: IDBConnection;
    let appConfig: IAppConfig;
    const uid: string = "12:23:43:44";

    const newTraits: ITraitValues = [{
        name: "trait1",
        value: "trait1value-modified"
    }, {
        name: "trait2",
        value: "trait2value-modified"
    }];

    const newStatus: INodeStatus = {
        errorCode: "1",
        errorReason: "test",
        status: STATUS.WORK,
        busy: false,
    }

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

    it("should save all the statuses in database", async () => {
        // GIVEN
        const broker: IMessageBroker = diConfig.messageBroker;
        const db = diConfig.dbService.Node;
        publishDeviceInfoMessage(broker);

        await wait(100);
        // WHEN
        publishDeviceStatusMessage(broker, uid, "any value is good", defaultMockTraits, defaultStatus);
        await wait(100);

        publishDeviceStatusMessage(broker, uid, "any value is good", newTraits, newStatus);

        await wait(100);

        // THEN
        const states = await db.loadStates(uid, {}, 10, 0);

        expect(states).to.be.a("array");
        expect(states.length).to.be.equal(3);

        // default state
        const state0 = states[0];
        expect(state0.timestamp).to.be.a("number").greaterThan(1635027959293);
        expect(state0.status).to.be.deep.equal({
            errorCode: "0",
            errorReason: "",
            status: STATUS.WORK
        });
        expect(state0.traits).to.be.an("array");
        expect(state0.traits.length).to.be.equal(0);

        // first update
        const state1 = states[1];
        expect(state1.timestamp).to.be.a("number").greaterThan(1635027959293);
        expect(state1.status).to.be.deep.equal(defaultStatus);
        expect(state1.traits).to.be.an("array");
        expect(state1.traits.length).to.be.equal(2);
        expect(state1.traits).to.be.deep.equal(defaultMockTraits);

        // second update
        const state2 = states[2];
        expect(state2.timestamp).to.be.a("number").greaterThan(1635027959293);
        expect(state2.status).to.be.deep.equal(newStatus);
        expect(state2.traits).to.be.an("array");
        expect(state2.traits.length).to.be.equal(2);
        expect(state2.traits).to.be.deep.equal(newTraits);
    });

    it("should be stored in app, having latest state and props", async () => {
        // GIVEN
        const broker: IMessageBroker = diConfig.messageBroker;
        const manager = Application.nodeManager;

        // WHEN
        publishDeviceInfoMessage(broker);
        await wait(100);

        publishDeviceStatusMessage(broker, uid, "any value is good", defaultMockTraits, defaultStatus);
        await wait(100);

        publishDeviceStatusMessage(broker, uid, "any value is good", newTraits, newStatus);
        await wait(100);

        // THEN
        const node = manager.findNode(uid);

        expect(node).not.to.be.undefined;

        // stateHistory is up-to-date with latest database changes?
        expect(node.stateHistory.length).to.be.equal(3);

        // the state is the latest from history
        expect(node.state).to.be.deep.equal(node.stateHistory[2]);

        // traits are also updated to the latest
        expect(node.state.traits).to.be.deep.equal(newTraits);
    });
});
