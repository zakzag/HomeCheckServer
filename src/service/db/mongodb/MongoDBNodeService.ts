/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import IDBConnection from "../DBConnectionInterface";
import DBCONST from "./MongoDBConstants";
import { INodeState } from "../../../node/NodeState";
import { INodeProps } from "../../../node/NodeProps";
import TInjectable from "../../../mixin/Injectable";
import DBService, { IDBNodeService, IDBNodeServiceDIConfig } from "../DBService";

class TBaseDBNodeService { }

class TMongoDBNodeService extends TInjectable(TBaseDBNodeService) implements IDBNodeService {
    /**
     * Loads node properties: uid, type, typeid, subevents,pubevents etc...
     * 
     * @param nodeUID unique ID of the node
     */
    private _dbConn: IDBConnection;
    /**
     * Custom inject method to create _db method
     * 
     * @param diConfig   DI configuration object
     */
    public inject(diConfig: IDBNodeServiceDIConfig): this {
        super.inject(diConfig);
        return this;
    }

    public setup(): this {
        this.inject({
            dbConn: DBService.Connection
        });

        return this;
    }

    get dbConn(): IDBConnection {
        return this._dbConn;
    }

    /**
     * Generates table name from prefix and node uid
     * 
     * @param prefix   This is a const, table name prefix for each nodes
     * @param uid      Node unique ID coming from related physical node
     * 
     * @return database table name
     */
    /* @TODO: put this method somewhere else */
    private getTableName(prefix: string, uid: string) {
        return `${prefix}${uid.substr(0, 2)}${uid.substr(3, 2)}${uid.substr(6, 2)}${uid.substr(9, 2)}`;
    }

    public async loadState(nodeUID: string): Promise<INodeState> {
        let node = await (this.dbConn.getDB()
            .collection(this.getTableName(DBCONST.NODE_PREFIX, nodeUID))
            .find({})
            .sort({ createdAt: -1 })
            .limit(1)
            .toArray());

        return node[0];
    }

    public async insertState(nodeUID: string, state: INodeState): Promise<any> {
        await this.dbConn.getDB().collection(this.getTableName(DBCONST.NODE_PREFIX, nodeUID))
            .insertOne(state, {
                forceServerObjectId: true
            });
    }

    public async loadProps(nodeUID: string): Promise<INodeProps> {
        const props = await this.dbConn.getDB()
            .collection(DBCONST.NODE_LIST)
            .findOne({
                uid: nodeUID
            });

        delete props._id;
        return props;
    }

    public async saveProps(props: INodeProps): Promise<object> {
        return await this.dbConn.getDB()
            .collection(DBCONST.NODE_LIST)
            .updateOne({ uid: props.uid }, {
                $set: props
            }, {
                upsert: true
            });
    }

    public async loadStates(
        nodeUID: string,
        filter: object = {},
        limit: number = 100,
        skip: number = 0
    ): Promise<INodeState[]> {
        return await this.dbConn.getDB()
            .collection(this.getTableName(DBCONST.NODE_PREFIX, nodeUID))
            .find(filter)
            .skip(skip)
            .limit(limit)
            .sort({
                timestamp: 1
            })
            .toArray();
    }
}

export default TMongoDBNodeService;