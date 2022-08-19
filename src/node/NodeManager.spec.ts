/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import * as TH from "../util/TestHelper";
import * as chai from "chai";
import { expect } from "chai";
import TNodeManager, { INodeManagerDIConfig } from "./NodeManager";
import { generateUID } from "../util/Util";
import TNodeState from "./NodeState";
import NodeFactory from "./NodeFactory";
import TNodeProps from "./NodeProps";
/*import {IResponseMessageMeta} from "../schema/responseMessage/ResponseMessageMetaSchema";
import {IResponseMessageData} from "../schema/responseMessage/ResponseMessageDataSchema";*/
import IMessageBroker from "../service/message/MessageBrokerInterface";
import {IDBService} from "../service/db/DBService";
import INode from "./NodeInterface";

TH.setupTests();

describe("NodeManager", () => {
    let nodeManager: TNodeManager;
    let nodeManagerDIConfig: INodeManagerDIConfig;

    let node1: INode;
    let node2: INode;

    let messageBroker: IMessageBroker;
    let dbService: IDBService;
    let nodeFactory;


    beforeEach(() => {
        messageBroker = TH.createMockMessageBroker();
        dbService = TH.createMockDBService();
        nodeFactory = <any>TH.createMockNodeFactory()

        node1 = NodeFactory.createFromData({
            props: {
                name: "testName",
                type: "testType",
                uid: "01:00:00:00"
            },
            state: {
                timestamp: new Date().valueOf(),
            }
        });

        node2 = NodeFactory.createFromData({
            props: {
                name: "testName",
                type: "testType",
                uid: "02:00:00:00"
            },
            state: {
                timestamp: new Date().valueOf(),
            }
        });

        nodeManagerDIConfig = {
            messageBroker,
            dbService,
            nodeFactory
        };

        nodeManager = new TNodeManager().inject(nodeManagerDIConfig);
    });

    it("NodeList should exist", () => {
        // GIVEN
        // WHEN
        // THEN
        expect(nodeManager.nodeList).not.to.be.undefined;
    });

    it("Should inject everything properly", () => {
        expect(nodeManager.nodeList.size).to.be.equal(0);
    });

    it("Manager Should add a child", () => {
        // GIVEN
        // WHEN
        // THEN
        nodeManager.addNode(node1);
        expect(nodeManager.nodeList.size).to.be.equal(1);

    });

    it("Manager Should add a child only once", () => {
        // GIVEN
        // WHEN
        nodeManager.addNode(node1);
        // THEN

        expect(nodeManager.addNode.bind(nodeManager, node1)).throws();
    });

    it("Manager Should remove a child", () => {
        // GIVEN
        nodeManager.addNode(node1);
        // WHEN
        nodeManager.removeNodeByUID(node1.uid);
        // THEN

        expect(nodeManager.nodeList.size).to.be.equal(0);
        expect(nodeManager.findNode(node1.uid)).to.be.undefined;
    });

    it("Manager Should throw error when node does not exist in list", () => {
        // GIVEN
        nodeManager.addNode(node1);
        // WHEN
        // THEN

        expect(nodeManager.removeNodeByUID.bind(node2.uid)).to.throw();
        expect(nodeManager.nodeList.size).to.be.equal(1);
    });

    it("Should forEach iterate through all items", () => {

        let nodes: Array<INode> = [];
        const nodeCount = 10;
        for (let i = 0; i < nodeCount; i++) {
            /* @TODO: create schema for TNode constructor object, like props,state */
            nodes.push(NodeFactory.createFromData({
                props: {
                    uid: generateUID(),
                    type: "node",
                    name: "name",
                    createdAt: new Date().valueOf()
                },
                state: {
                    timestamp: new Date().valueOf()
                }
            }));
        }
        // GIVEN
        nodeManager
            .addNode(node1)
            .addNode(nodes[0])
            .addNode(nodes[1])
            .addNode(nodes[2])
            .addNode(nodes[3])
            .addNode(nodes[4])
            .addNode(nodes[5])
            .addNode(nodes[6])
            .addNode(nodes[7])
            .addNode(nodes[8])
            .addNode(nodes[9])

        nodeManager.nodeList.set(nodes[9].uid, nodes[9]);
        // WHEN
        let i: number = 0;

        nodeManager.forEach((node) => { i++; });
        // THEN
        expect(i).to.be.equal(11);
    });

    it("buildNodeFromDB should call DB service", async () => {
        // GIVEN
        let uid = "11:23:34:45";
        let testProps = TNodeProps.defaultProps;
        let testState = TNodeState.create({ 
            timestamp: new Date("1976-11-04").valueOf() 
        });

        nodeManagerDIConfig.dbService.Node.loadProps =
            chai.spy(async () => { return testProps });

        nodeManagerDIConfig.dbService.Node.loadState =
            chai.spy(async (uid: string) => { return testState });

        nodeManagerDIConfig.dbService.Node.loadStates =
            chai.spy(async (nodeUID, filter) => { return [testState] });

        nodeManagerDIConfig.nodeFactory.createFromData =
            chai.spy(nodeManagerDIConfig.nodeFactory.createFromData);

        //WHEN
        await nodeManager.buildNodeFromDB(uid);

        // THEN
        expect(nodeManagerDIConfig.dbService.Node.loadState).to.be.called.with(uid);
        expect(nodeManagerDIConfig.dbService.Node.loadProps).to.be.called.with(uid);
        // @TODO: check why it's not working
        //expect(nodeManagerDIConfig.dbService.Node.loadStates).to.have.been.called.with(uid, {});
        expect(nodeManagerDIConfig.nodeFactory.createFromData).to.be.called();
        
    });
});
