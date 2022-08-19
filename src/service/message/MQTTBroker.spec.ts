/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import * as TH from "../../util/TestHelper";
import * as chai from 'chai';
import { expect } from 'chai';
import * as mock from 'mock-require';

// mocking complete mqtt library
let mockMqttClient = TH.createMockMqttClient();

mock("mqtt", {
    connect(): object { return mockMqttClient },
    Client: mockMqttClient
});

mock("mqtt-emitter", function MQTTEmitter() {
    return TH.createMockMqttEmitter();
} );

import mqtt = require("mqtt");
import mockMqttEmitter = require("mqtt-emitter");
import TMQTTBroker, { EVENT } from "./MQTTBroker";
import { 
    TMessageBrokerType, 
    IBrokerCallback, 
    IMessageBrokerConfig 
} from "./MessageBrokerInterface";
import { IClientPublishOptions } from "mqtt";
import { getFullTopic } from '../../message/TopicHelper';

mock.stopAll();

describe("TMQTTBroker", () => {
    let broker: TMQTTBroker;
    const mockCfg: IMessageBrokerConfig = {
        type: TMessageBrokerType.MQTT,
        url: "local",
        port: 1883,
        rootTopic: "test-home"
    }

    beforeEach(() => {
        broker = new TMQTTBroker();
        
        broker.inject({
            emitter: mockMqttEmitter
        });
    });

    it("Should register new event for itself named 'connect'", () => {
        //GIVEN
        //WHEN
        //THEN
        expect(broker.hasEventType(EVENT.BROKER_CONNECT)).to.be.true;
    });

    it("Should store config", () => {
        //GIVEN
        //WHEN
        broker.setup(mockCfg);
        //THEN
        expect(broker.config).to.be.equal(mockCfg);
    });

    it("Should connect to mqtt broker and bind event handler on connect", () => {
        //GIVEN
        mqtt.connect = <any>chai.spy(mqtt.connect);
        (<any>mqtt.Client).on = chai.spy((<any>mqtt.Client).on);
        //WHEN
        broker.setup(mockCfg).connect();
        //THEN

        expect(mqtt.connect).to.be.called.once;
        expect((<any>mqtt.Client).on).to.be.called.exactly(6);
    });

    it("Should call mqtt emitter's \"on\" with given topic", () => {
        //GIVEN
        mockMqttEmitter.on = chai.spy(mockMqttEmitter.on);
        const testTopic = "test/topic";
        const mockMsgCallback = () => { };
        broker.setup(mockCfg);

        //WHEN
        broker.subscribe(testTopic, mockMsgCallback);
        //THEN
        expect(mockMqttEmitter.on).to.be.called();
    });

    it("Should call mqtt emitter's \"unsubscribe\" with given topic", () => {
        //GIVEN
        mockMqttEmitter.removeListener = chai.spy(mockMqttEmitter.removeListener);
        const testTopic = "test/topic"
        const mockMsgCallback: IBrokerCallback = () => { };
        //WHEN
        broker.unsubscribe(testTopic, mockMsgCallback);
        //THEN
        expect(mockMqttEmitter.removeListener).to.be.called
            .with(getFullTopic(broker.homeID, testTopic), mockMsgCallback);
    });

    it("Should publish String types of variables", () => {
        //GIVEN
        (<any>mqtt.Client).publish = chai.spy((<any>mqtt.Client).publish);
        const testTopic: string = "test/topic";
        const testOptions: IClientPublishOptions = { "qos": 1 };
        const testStringMsg: string = "testEvent";
        //WHEN
        broker.setup(mockCfg).connect();
        broker.publish(testTopic, testStringMsg, testOptions);
        //THEN
        expect((<any>mqtt.Client).publish).to.be.called
            .with(getFullTopic(broker.homeID, testTopic), testStringMsg, testOptions);
    });

    it("Should publish Buffer types of variables", () => {
        (<any>mqtt.Client).publish = chai.spy((<any>mqtt.Client).publish);
        const testTopic = "test/topic";
        const testOptions: IClientPublishOptions = { "qos": 1 };
        const testStringMsg: string = "testEvent";
        const testBufferMsg: Buffer = Buffer.from(testStringMsg);
        //WHEN
        broker.setup(mockCfg).connect();
        broker.publish(testTopic, testBufferMsg, testOptions);
        //THEN
        expect((<any>mqtt.Client).publish).to.be.called
            .with(getFullTopic(broker.homeID, testTopic), testBufferMsg, testOptions);
    });

    it("Should publish JSON types of variables", () => {
        (<any>mqtt.Client).publish = chai.spy((<any>mqtt.Client).publish);
        const testTopic: string = "test/topic";
        const testOptions: IClientPublishOptions = { "qos": 1 };
        const testJSONMsg: Object = { "something": "data" };
        const testJSONMsgStr: string = JSON.stringify(testJSONMsg);
        //WHEN
        broker.setup(mockCfg).connect();
        broker.publish(testTopic, testJSONMsg, testOptions);
        //THEN
        expect((<any>mqtt.Client).publish)
            .to.be.called.with(getFullTopic(broker.homeID, testTopic), testJSONMsgStr, testOptions);
    });
});