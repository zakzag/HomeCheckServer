/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { TObservable, TInjectable } from "../mixin/mixins";
import TNode from "./Node";
import { IDBService } from "../service/db/DBService";
import { TNodeFactory } from "./NodeFactory";
import IMessageBroker from "../service/message/MessageBrokerInterface";
import { INodeProps } from "./NodeProps";
import {INodeState, default as TNodeState} from "./NodeState";
import * as Debug from "../util/Debug";

import {
    InvalidNodeError,
    DBError,
    NodeRemoveError,
    InvalidNodePropsError
} from '../error/ErrorConstants';

import {
    IResponseMessageMeta,
    IResponseMessageData,
    IStatusForResponse,
    IInfoForResponse,
} from "../schema/schemas";

import INode from "./NodeInterface";
import {TNodeAttachEvent, TNodeListUpdateEvent, TNodeRemoveEvent} from "./NodeEvents";
import {EVENT} from "../event/EventConstants";
import INodeManager, {
    TNodeList,
    INodeManagerForEachCallback
} from "./NodeManagerInterface";
import {EventReasonSource} from "../event/EventReason";
import HCError from "../error/HCError";


/**
 * Dependency Configuration Interface for NodeManager
 */
interface INodeManagerDIConfig {
    messageBroker: IMessageBroker,
    dbService: IDBService,
    nodeFactory: TNodeFactory
}

/**
 * Base class for the inheritance, does nothing
 */
class TBaseNodeManager { }

class TNodeManager extends TInjectable(TObservable(TBaseNodeManager)) implements INodeManager {
    protected _messageBroker: IMessageBroker;
    protected _dbService: IDBService;
    protected _nodeList: TNodeList;
    protected _nodeFactory: TNodeFactory;

    constructor() {
        super();

        this.addEventTypes(EVENT.NODE_ATTACH, EVENT.NODE_REMOVE, EVENT.NODELIST_UPDATE);
    }

    public inject(diConfig: INodeManagerDIConfig): this {
        super.inject(diConfig);

        this._nodeList = new Map([]);

        return this;
    }

    public get nodeList(): TNodeList {
        return this._nodeList;
    }

    /**
     * Adds a node to the node list.
     * @param node 
     */
    public addNode(node: INode): this {
        if (!this.nodeList.has(node.uid)) {
            this.nodeList.set(node.uid, node);
            this.trigger(new TNodeListUpdateEvent({ uid: node.uid }, {
                uid: node.uid,
                source: EventReasonSource.Server,
            }));
        } else {
            throw new InvalidNodeError(`Node ${node.type}#${node.uid} already exist in node manager.`);
        }

        return this;
    }

    public removeNodeByUID(uid: string): this {
        const node = this.findNode(uid);

        if (!node) {
            throw new NodeRemoveError(`Node #${uid} does not exist in node manager.`);
        }

        this.trigger(new TNodeRemoveEvent({ uid }, { uid }));
        this.trigger(new TNodeListUpdateEvent({ uid }, { uid }));

        this.nodeList.delete(node.uid);

        return this;
    }

    /**
     * Iterates through the whole list of nodes, regardles if it is in the 
     * node tree or not (unattached nodes too)
     * This context will be the current node, but can be overwritten by
     * defining thisArg. 
     * 
     * @param iterator 
     * @param thisArg 
     */
    public forEach(
        iterator: INodeManagerForEachCallback,
        thisArg?: any
    ): this {
        this.nodeList.forEach(iterator.bind(thisArg), thisArg);

        return this;
    }

    /**
     * Finds a device in device tree/list or undefined if not found
     * 
     * @param uid  The uid of the device we look for
     */
    public findNode<TNodeType extends INode = TNode>(uid: string): TNodeType {
        return this.nodeList.get(uid) as TNodeType;
    }

    /**
     * Checks whether ModeManager has the specified node
     * 
     * @param uid  The uid of the device we look for 
     */
    public hasNode(uid: string): boolean {
        return !!this.findNode(uid);
    }

    /**
     * Rebuilds the whole tree getting data from the database
     * The database must be set before the action.
     * 
     */
    public async buildListFromDB() {
        Debug.detail("Getting nodes from persistent storage...");

        this._nodeList = await this.getNodesFromDB();

        Debug.detail("Building list done.");
    }

    /**
     * Retrieves all noe data from db and creates a Node for each
     * having all necessary DIs, props and states
     */
    public async getNodesFromDB(): Promise<TNodeList> {
        /* no fitering for getNodeList, we get all */
        let nodeList: INodeProps[] = await this._dbService.List.getNodeList({});
        /* @TODO: how to replace it with TNodeList */
        let resultList: TNodeList = new Map<string, TNode>();

        /* for..of loop instead of forEach makes building nodes in sequence and resultlist
           will filled with data. using forEach resultList would be empty as foreach
           creates new generator function for each iteration and won't wait until they end
           but executes the next statement immediately.*/
        /* Load all props and states and statehistory from database */
        for (let nodeProps of nodeList) {
            try {
                nodeProps.uid;
                const node:INode  = await this.buildNodeFromDB(nodeProps.uid);

                // if an error occured during adding a node, it should not stop the
                // application, so nodemanager handles it here by triggering  a debug.error message,
                // but won't stop the application, otherwise it will bubble up the error.
                try {
                    resultList.set(node.uid, node);
                    this.trigger(new TNodeListUpdateEvent({}, {}));

                } catch(e) {
                    if (e instanceof InvalidNodeError) {
                        //Debug.hcError(e, "  ");
                    } else {
                        throw e;
                    }
                }

            } catch (e) {
                /* need to handle errors here for each iteration otherwise one 
                   bug would ruin the whole init process, and kill server
                   but this way, only the bugous node won't be created */
                let err = new DBError(`while recovering node from database`, e);
                Debug.error(err);
            }
        }

        return resultList;
    }

    /**
     * Restores node from database by loading props and states,
     * also injects DIs.
     * 
     * @param uid   Node uid to look for
     */
    public async buildNodeFromDB(uid: string): Promise<any> {
        let props: INodeProps = await this._dbService.Node.loadProps(uid);
        let state: INodeState = await this._dbService.Node.loadState(uid);
        delete (state as any)._id;

        const node: INode = this._nodeFactory
            .createFromData({ props, state })
            .setup({
                messageBroker: this._messageBroker,
                db: this._dbService.Node
            });

        await node.loadStateHistory();

        return node;
    }

    /**
     * Creates a new node and saves it to database. It is used, when a new device
     * shows up in the system.
     * In this case, NodeManager will have to save it to database.
     * This function is invoked on response of a "get-info" message, and
     * in this stage Node does not have any state, so we need to create one
     * @TODO: find out how to deal with it
     * 
     * @param meta    metadata for Node, should come from message payload
     * @param data    properties of the Node
     */
    public async createNewNode(meta: IResponseMessageMeta, data: IResponseMessageData) {
        Debug.detail("Saving Node to database : #", meta.uid);

        const nowDate = (new Date()).valueOf();

        const infoData = (data as IInfoForResponse).info;
        let statusData = (data as IStatusForResponse).status || TNodeState.defaultState.status;

        if (infoData === undefined) {
            throw new InvalidNodePropsError("Message does not contain info about the device");
        }

        if (statusData === undefined) {
            Debug.detail(`Message from device#${meta.uid} does not have status data, default used (requestId: ${meta.requestId})`)
        }

        /* Props object on a DeviceNode and the info it gets from a get-info response is not the same
         * info has less data than props do, because
         * createdAt, lastUpdate, enabled are set on creation of a new Device in the Server,
         * the remaining (uid, name, type, status, firmwareVersion, params) are the ones that
         *  are provided by get-info response.
         */
        const nodeData = {
            props: {
                ...infoData,
                createdAt: nowDate,
                lastUpdate: nowDate,
                enabled: true
            },
            state: {
                timestamp: nowDate, /* new Date is perfect here, this is exactly when
                                           this device first appear in the system */
                status: statusData,
                traits: []
            }
        }

        const newNode = this._nodeFactory
            .createFromData(nodeData)
            .setup({
                messageBroker: this._messageBroker,
                db: this._dbService.Node
            });
        
        try {
            await newNode.saveAll();

            /*  Adds the new node to the nodeList (it assumes that it does not exist yet,
                because saveAll would have thrown an error
                nodeList.set must be before triggering attachevent, because webapi subscribed to attachevent
                and look for this node in nodeList
            */
            this.nodeList.set(newNode.uid, newNode);

            this.trigger(new TNodeAttachEvent({
                node: newNode
            }, { uid: newNode.uid }));

        } catch (e) {
            throw new DBError("Error during saving new device", e);
        }
    }

    public async removeNode(uid: string): Promise<any> {
        throw new HCError("Not implemented");
    }
}

export default TNodeManager;
export {
    INodeManagerDIConfig,
    TNodeList
}