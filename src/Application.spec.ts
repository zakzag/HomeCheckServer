/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Application as app } from "./Application";
import { IAppConfig, IAppDIConfig } from "./Application";
import TNodeManager from "./node/NodeManager";
import IMessageBroker from "./service/message/MessageBrokerInterface";
import * as TestHelper from "./util/TestHelper";
import { expect } from 'chai';
import { IAppController } from "./controller/AppController";
import * as chai from 'chai';
import {IWebApi} from "./webapi/WebApiInterface";
import * as TH from "./util/TestHelper";

TH.setupTests();

describe("TApplication", () => {
  let config: IAppConfig;
  let appSetup: IAppDIConfig;
  let nodeMan: TNodeManager;
  let msgBroker: IMessageBroker;
  let appController: IAppController;
  let webApi: IWebApi;

  beforeEach(() => {
    config = TestHelper.createMockAppConfig();
    nodeMan = TestHelper.createMockNodeManager();
    msgBroker = TestHelper.createMockMessageBroker();
    appController = TestHelper.createMockAppController();
    webApi = TestHelper.createMockWebApi();

    appSetup = {
      config,
      nodeManager: nodeMan,
      messageBroker: msgBroker,
      appController: appController,
      nodeFactory: null,
      eventFactory: null,
      dbService: TestHelper.createMockDBService(),
      webApi
    };
  });

  it('should store config data', () => {
    // GIVEN
    // WHEN
    app.inject(appSetup);

    // THEN
    expect(app.nodeManager).to.equal(nodeMan);
    expect(app.messageBroker).to.equal(msgBroker);
    expect(app.appController).to.equal(appController);
    expect(app.config).to.equal(config);
  });

  it('should store database in homeID', async () => {
    // GIVEN
    // WHEN
    app.inject(appSetup);

    await app.run();

    // THEN
    expect(app.homeID).to.equal(config.db.database);
  });

  it('should call methods in run()', async () => {
    // GIVEN
    // WHEN
    app.inject(appSetup);
    app.dbService.Node.setup = chai.spy(app.dbService.Node.setup);
    app.dbService.List.setup = chai.spy(app.dbService.List.setup);
    app.messageBroker.connect = chai.spy(app.messageBroker.connect);
    app.messageBroker.setup = chai.spy(app.messageBroker.setup);
    app.messageBroker.on = chai.spy(app.messageBroker.on);
    app.appController.init = chai.spy(app.appController.init);

    await app.run();
    
    //THEN
    expect(app.dbService.List.setup).to.be.called();
    expect(app.dbService.Node.setup).to.be.called();
    expect(app.messageBroker.connect).to.be.called();
    expect(app.messageBroker.setup).to.be.called.with(config.messageBroker);
    expect(app.appController.init).to.be.called();
  });
});