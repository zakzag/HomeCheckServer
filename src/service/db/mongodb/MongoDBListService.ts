/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import IDBListService, { IDBListServiceDIConfig } from "../DBListServiceInterface";
import DBCONST from "./MongoDBConstants";
import TInjectable from "../../../mixin/Injectable";
import * as mongoDB from "mongodb";
import DBService, { IDBConnection } from "../DBService";
import { TAnyObj } from "../../../util/Types";
import {INodeProps} from "../../../node/NodeProps";

class TBaseDBListService { }

class TMongoDBListService extends TInjectable(TBaseDBListService) implements IDBListService {
    /* @TODO: is this needed? */
    private _dbConn: IDBConnection;
    private _db: mongoDB.Db; //DB from MongoDB

    get dbConn():IDBConnection {
        return this._dbConn;
    }

    public setup(): this {
        this.inject({ 
            dbConn: DBService.Connection
        });

        return this;
    }

    public inject(diConfig: IDBListServiceDIConfig): this {
        super.inject(diConfig);

        /* @TODO: is this needed? */
        this._db = this.dbConn.getDB();
        return this;
    }

    public async getNodeList(filter: TAnyObj = {}): Promise<INodeProps[]> {
        return (this._db.collection(DBCONST.NODE_LIST).find({}).toArray() as unknown) as INodeProps[];
    }

    public async getNodeProps(uid: string): Promise<INodeProps> {
        return (await this._db.collection(DBCONST.NODE_LIST).find({ uid })
            .toArray() as unknown as INodeProps)[0];
    }
}

export default TMongoDBListService;