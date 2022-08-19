/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { INodeState } from "../../node/NodeState";
import { INodeProps } from "../../node/NodeProps";
import { IDBConnection } from "./DBService";

interface IDBNodeServiceDIConfig {
    dbConn: IDBConnection
}

export default interface IDBNodeService {
    /**
     * Setup dependencies, using default
     * This method should be used if NodeService is used in application
     * For tests use Inject instead
     */
    setup(): this;
    /**
     * Standard inject method from TInjectable
     * @param diConfig 
     */
    inject(diConfig: IDBNodeServiceDIConfig): this;
    /**
     * Retrieves node properties (not changing data)
     * from persistent storage
     * 
     * @param nodeUID unique ID of the node
     */
    loadProps(nodeUID: string): Promise<INodeProps>
    /**
     * Saves node properties into persistent storage
     * 
     * @param props  node properties
     */
    saveProps(props: INodeProps): Promise<object>;
    /**
     * Load node's current state from persistent storage
     * @param nodeUID 
     */
    loadState(nodeUID: string): Promise<INodeState>;
    /**
     * Saves node state into persistent storage
     * 
     * @param nodeUID   unique ID of the node
     * @param state     node state as an onject
     */
    insertState(nodeUID: string, state: INodeState): Promise<any>;
    /**
     * Loads previous states of a node (i.e. for time diagram, historic data)
     * from persistent storage (i.e. database)
     * 
     * @param nodeUID    uid of the node (xx:xx:xx:xx)
     * @param filter     filter object (@see mongo documentation)
     * @param limit      max number of items
     * @param skip       skip the first xxx
     */
    loadStates(
        nodeUID: string,
        filter?: object,
        limit?: number,
        skip?: number
    ): Promise<INodeState[]>
}

export {
    IDBNodeServiceDIConfig
}