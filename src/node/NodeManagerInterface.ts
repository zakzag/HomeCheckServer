/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/


import INode from "./NodeInterface";
import TNode from "./Node";
import {IResponseMessageMeta} from "../schema/responseMessage/ResponseMessageMetaSchema";
import {IResponseMessageData} from "../schema/responseMessage/ResponseMessageDataSchema";

type TNodeList = Map<string, INode>;

interface INodeManagerForEachCallback {
    (node: INode): any
}


interface INodeManager  {
    /**
     * Adds a node to the node list.
     * @param node
     */
    addNode(node: INode): this;

    removeNodeByUID(uid: string): this;
    /**
     * Iterates through the whole list of nodes, regardles if it is in the
     * node tree or not (unattached nodes too)
     * This context will be the current node, but can be overwritten by
     * defining thisArg.
     *
     * @param iterator
     * @param thisArg
     */
    forEach(
        iterator: INodeManagerForEachCallback,
        thisArg?: any
    ): this;

    /**
     * Finds a device in device tree/list or undefined if not found
     *
     * @param uid  The uid of the device we look for
     */
    findNode<TNodeType extends INode = TNode>(uid: string): TNodeType

    /**
     * Checks whether ModeManager has the specified node
     *
     * @param uid  The uid of the device we look for
     */
    hasNode(uid: string): boolean;

    /**
     * Rebuilds the whole tree getting data from the database
     * The database must be set before the action.
     *
     */
    buildListFromDB();

    /**
     * Retrieves all noe data from db and creates a Node for each
     * having all necessary DIs, props and states
     */
    getNodesFromDB(): Promise<TNodeList>;

    /**
     * Restores node from database by loading props and states,
     *
     * @param uid   Node uid to look for
     */
    buildNodeFromDB(uid: string): Promise<any>;

    /**
     * Creates a new node and save it to database. It is used, when a new device
     * shows up in the system.
     * In this case, NodeManager will have to save it to database.
     * This function is invoked on response of a "get-info" message, and
     * in this stage Node does not have any state, so we need to create one
     * @TODO: find out how to deal with it
     *
     * @param meta    metadata for Node, should come from message payload
     * @param data    properties of the Node
     */
    createNewNode(meta: IResponseMessageMeta, data: IResponseMessageData);

    /**
     * Removes a node from the system.
     * This method is a low level function
     * If removeData is true, it will remove history data and its collection
     *
     * @param {string} uid      node unique ID
     * @returns {Promise<any>}
     */
    removeNode(uid: string, removeData: boolean): Promise<any>;
}

export default INodeManager;

export {
    TNodeList,
    INodeManagerForEachCallback
}