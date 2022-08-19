/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { TAnyObj } from "../../util/Types";
import { INodeProps } from "../../node/NodeProps";
import { IDBConnection } from "./DBService";
 

/* configuration interface for tree service */
interface IDBListServiceDIConfig {
    dbConn: IDBConnection
}

interface IDBListService {
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
    inject(diConfig: IDBListServiceDIConfig): this;

    /**
     * Returns all nodes' Props installed in the system
     * @param {TAnyObj} filter
     * @returns {Promise<INodeProps[]>}
     */
    getNodeList(filter: TAnyObj | void): Promise<INodeProps[]>;

    /**
     * Returns a particular node's Props defined by uid
     * @param {string} uid
     * @returns {Promise<INodeProps>}
     */
    getNodeProps(uid: string): Promise<INodeProps>;
}

export default IDBListService;
export {
    IDBListServiceDIConfig
}