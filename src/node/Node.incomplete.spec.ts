/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {expect} from "chai";
import TNode, {INodeDIConfig} from "./Node";
import {createMockDBService} from "../util/TestHelper";
import {EVENT} from "../event/EventConstants";
import * as chai from 'chai';
import * as TH from "../util/TestHelper";
import TNodeState, {INodeState} from './NodeState';
import {INodeProps} from './NodeProps';
import {extend, generateUID} from "../util/Util";
import NodeFactory from "./NodeFactory";
import {STATUS} from "./NodeConstants";
import INode from "./NodeInterface";
import TEvent from "../event/Event";

TH.setupTests();

describe("TNode", () => {
    let testConfig: INodeDIConfig;
    const db = createMockDBService().Node;
    db.inject;//remove pls
    let node: INode;

    let createErrorState: Function = (status, code) => {
        return {
            status: {
                status: STATUS.FAILURE,
                errorCode: "0",
                errorReason: "",
                busy: false
            },
            traits: [],
            timestamp: 1
        }
    }

    beforeEach(() => {
        testConfig = {
            db: createMockDBService().Node,
            messageBroker: TH.createMockMessageBroker()
        }
        node = new TNode({
            props: {
                uid: generateUID(),
                type: "testType",
                name: "testName",
                enabled: true,
                firmwareVersion: "",
                createdAt: 0,
                lastUpdate: 0,
                params: []
            },
            state: {
                timestamp: new Date().valueOf(),
                status: {
                    errorCode: "0",
                    errorReason: "",
                    status: STATUS.WORK,
                    busy: false
                },
                traits: []
            }
        }).setup({
            db: createMockDBService().Node,
            messageBroker: TH.createMockMessageBroker()
        });
    });

    it("Constructor Should set initial props and state and define events ", () => {
        // GIVEN
        const nodeState: any = {
            timestamp: new Date("2020-04-30").valueOf(),
            testKey: "testValue",
            testKey2: "testValue2"
        }

        const nodeProps: INodeProps = {
            uid: "11:22:33:44",
            type: "testType",
            name: "testName",
            enabled: true,
            firmwareVersion: "",
            createdAt: 0,
            lastUpdate: 0,
            params: []

        }

        //const extendedProps = extend({ children: [] }, TNodeProps.defaultProps, nodeProps);
        const extendedState = extend(TNodeState.defaultState, nodeState);
        // WHEN
        const node = new TNode({props: nodeProps, state: nodeState})

        // THEN
        //expect(node.props).to.be.deep.eq(extendedProps);
        expect(node.state).to.be.deep.eq(extendedState);

        expect(node.hasEventType(EVENT.NODE_STATE_UPDATE)).to.be.true;
        expect(node.hasEventType(EVENT.NODE_PROPS_UPDATE)).to.be.true;
        expect(node.hasEventType(EVENT.NODE_PARAMS_UPDATE)).to.be.true;
    });

    it("Setup should throw error when db is not set", () => {
        // GIVEN
        testConfig.db = undefined;

        // WHEN
        expect(node.setup.bind(node, testConfig)).to.throw();
        // THEN
    });

    it("Setup should throw error when messageBroker is not set", () => {
        // GIVEN
        //let testNode: INode = NodeFactory.createFromData({});


        //testConfig.messageBroker = undefined;

        // WHEN
        //expect(testNode.setup.bind(testNode, testConfig)).to.throw();
        // THEN
    });

    it("Setup should not throw error when everything set", () => {
        // GIVEN
        // WHEN
        let testNode: INode = NodeFactory.createFromData({});
        // THEN
        expect(testNode.setup.bind(testNode, testConfig)).to.not.throw();
    });

    it("Should set state", () => {
        //GIVEN
        const status = {errorCode: "0", errorReason: "", status: STATUS.WORK, busy: false };
        const modStatus = {errorCode: "1", errorReason: "1", status: STATUS.UNAVAILABLE, busy: false};
        const traits = [{name: "1", value: "1"}];
        const modTraits = [{name: "2", value: "2"}];
        const initState: INodeState = {timestamp: 1213123, status, traits: traits};
        const modState: object = {timestamp: 1213123, status: modStatus, traits: modTraits};
        const expectedState = {timestamp: 1213123, status: modStatus, traits: modTraits};

        //WHEN
        /* <any> is only for testing purposes, this way 
           it is not needed to fill state with valid items */
        let node = new TNode({props: <any>{}, state: <any>initState}).inject(testConfig);

        node.setState(<any>modState);
        //THEN
        expect(node.state.status).to.be.deep.equal(expectedState.status);
    });


    it("Should store name, type, uid, name", () => {
        //GIVEN
        const name = "testName";
        const type = "testType";
        const uid = "11:22:33:44";
        //WHEN
        let testNode = new TNode({props: <any>{name, type, uid}});
        //THEN
        expect(testNode.name).to.be.equal(name);
        expect(testNode.type).to.be.equal(type);
        expect(testNode.uid).to.be.equal(uid);
    })

    it("Should load state", () => {
        //GIVEN
        const db = {
            loadState: () => {
                return new Promise(() => {
                })
            }
        };
        const node = new TNode().inject({
            db: db
        });
        db.loadState = chai.spy(db.loadState);
        //WHEN
        node.loadState();
        //THEN
        expect(db.loadState).to.be.called.with(node.uid);
    });

    /* using async in function definition make parameter "done" unnecessary.
     * await statement waits until node.loadProps() is executed THEN
     * it do the assertion. if async and await were removed, we should use
     * promise then and call "done" in it.
     */
    it("Should load props", async function () {
        //GIVEN
        const uid: string = "uid";
        const type: string = "type"
        const name: string = "name"
        const props: object = {
            uid, type, name
        }
        const db = {
            loadProps: () => {
                return new Promise((resolve) => {
                    // must be resolved
                    return resolve(props);
                });
            }
        };
        const node = new TNode().inject({
            db
        });

        db.loadProps = chai.spy(db.loadProps);
        //WHEN
        try {
            let f = await node.loadProps();
            f.createdAt;
        } catch (e) {
            console.error(e);
        }
        //THEN

        expect(node.uid).to.be.equal(uid);
        expect(node.type).to.be.equal(type);
        expect(node.name).to.be.equal(name);
        expect(node.props).to.be.equal(props);
    });

    it("should trigger failure event when error occurred (errorCode changes to non-zero value)", () => {
        const spy = chai.spy((event: TEvent) => {
        });
        node.on(EVENT.NODE_FAILURE, spy);

        node.setState(createErrorState(STATUS.WORK, 1));

        expect(spy).to.be.called();
    });

    it("should trigger failure event when error occurred (status changes to FAILURE)", () => {
        const spy = chai.spy((event: TEvent) => {
        });
        node.on(EVENT.NODE_FAILURE, spy);

        node.setState(createErrorState(STATUS.FAILURE, 0));

        expect(spy).to.be.called();
    });

    it("should throw error when trait length changes", () => {
        const firstState: INodeState = {
            status: {
                status: STATUS.WORK,
                errorCode: "0",
                errorReason: "",
                busy: false,
            },
            traits: [{
                name: "trait1",
                value: "value1"
            }],
            timestamp: 1
        }

        const secondState: INodeState = {
            status: {
                status: STATUS.WORK,
                errorCode: "0",
                errorReason: "",
                busy: false,
            },
            traits: [{
                name: "trait1",
                value: "value1"
            }, {
                name: "trait2",
                value: "value2"
            }],
            timestamp: 1
        }

        // WHEN
        node.setState(firstState);

        // THEN
        expect(() => node.setState(secondState)).to.throw();
    });

    it("should trigger NODE_PARAMS_UPDATE when params changed", () => {
        const props1: INodeProps = {
            name: "dereg",
            params: [
                {
                    name: "param1",
                    value: "value1"
                }, {
                    name: "param2",
                    value: "value2"
                }
            ],
            firmwareVersion: "1.1.2",
            createdAt: 1231231,
            lastUpdate: 123123,
            enabled: true,
            type: "wateringstation",
            uid: "11:22:33:44"
        }

        const props2: INodeProps = {
            name: "dereg",
            params: [
                {
                    name: "param1",
                    value: "value1"
                }, {
                    name: "param2",
                    value: "value3"
                }
            ],
            firmwareVersion: "1.1.2",
            createdAt: 1231231,
            lastUpdate: 123123,
            enabled: true,
            type: "wateringstation",
            uid: "11:22:33:44"
        }

        const spy = chai.spy((event: TEvent) => {
        });

        node.on(EVENT.NODE_PARAMS_UPDATE, spy);

        /* It also checks that first setProps won't throw error */
        node.setProps(props1);
        node.setProps(props2);

        expect(spy).to.be.called.exactly(1);
    });


    /*it("Should load all", async (done) => {
        //GIVEN
        db.loadState = async (nodeUID: string): Promise<INodeState> => {
            return  Promise.resolve(TNodeState.defaultState);
        }

        db.loadStates = async () => {
            return [];
        }

        db.loadProps = async (nodeUID: string): Promise<INodeProps> => {
            return Promise.resolve(TNodeProps.defaultProps);
        }

        node.loadProps = chai.spy(node.loadProps);
        node.loadState = chai.spy(node.loadState);
        node.loadStateHistory = chai.spy(node.loadStateHistory);


        //WHEN
        await node.loadAll();
        //THEN
        // @TODO: check why not working
        expect(db.loadState).to.be.called();
        expect(db.loadProps).to.be.called();

        done();
    });*/

    /*it("Should save state", () => {
        //GIVEN
        db.insertState = chai.spy(() => {
            return new Promise((resolve) => {
                return resolve();
            });
        });

        //WHEN
        node.insertState();
        //THEN
        expect(db.insertState).to.be.called.with(node.uid, node.state);
    });

    it("Should save props", () => {
        //GIVEN
        db.saveProps = chai.spy(() => {
            return new Promise((resolve) => {
                return resolve();
            });
        });

        //WHEN
        node.saveProps();
        //THEN
        expect(db.saveProps).to.be.called.with(node.props);
    });

    it("Should save all", async () => {
        //GIVEN
        db.saveProps = chai.spy(() => {
            return new Promise((resolve) => {
                return resolve();
            });
        });

        db.insertState = chai.spy(() => {
            return new Promise((resolve) => {
                return resolve();
            });
        });

        //WHEN
        await node.saveAll();
        //THEN
        expect(db.saveProps).to.be.called.with(node.props);
        expect(db.insertState).to.be.called.with(node.uid, node.state);
    });*/


});