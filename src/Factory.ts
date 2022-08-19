/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import {DevelopmentError, RuntimeError} from "./error/ErrorConstants";

type TFactoryItemClass<TItemType> = { new(...args: any[]): TItemType };

interface IItemTypeEntry<TItemType> {
    itemType: string;
    itemClass: TFactoryItemClass<TItemType>;
}


interface IFactory<TItemType> {
    register(itemType: string | TFactoryItemClass<TItemType>, itemClass?: TFactoryItemClass<TItemType>): this;
    get(itemType: string): IItemTypeEntry<TItemType>;
    getRegisteredItems(): string[];
    create(itemType: string, ...args: any[]): TItemType;
    empty();
    isRegisteredType(itemType: string);
}

class TFactory<TItemType> implements IFactory<TItemType> {
    protected _itemTypeList: { [name: string]: IItemTypeEntry<TItemType> };

    constructor() {
        this._itemTypeList = {};
    }

    public register(itemType: string | TFactoryItemClass<TItemType>, itemClass?: TFactoryItemClass<TItemType>): this {
        if(typeof itemType === "string") {
            if (this.isRegisteredType(itemType)) {
                throw new DevelopmentError(`Item Type "${itemType}" is already registered`);
            }

            this._itemTypeList[itemType] = {
                itemType: itemType,
                itemClass: itemClass
            };
        } else {
            throw new DevelopmentError("Not implemented way of call");
        }

        return this;
    }

    public get(itemType: string): IItemTypeEntry<TItemType> {
        if (this.isRegisteredType(itemType)) {
            return this._itemTypeList[itemType];
        } else {
            throw new Error(`Item type "${itemType}" does not exist`);
        }
    }

    public getRegisteredItems(): string[] {
        return Object.keys(this._itemTypeList);
    }

    public create(itemType: string, ...args: any[]): TItemType {
        if (this.isRegisteredType(itemType)) {
            return new this._itemTypeList[itemType].itemClass(...args);
        } else {
            throw new RuntimeError(`Item type "${itemType}" does not exist`);
        }
    }

    public empty() {
        this._itemTypeList = {};
    }

    public isRegisteredType(itemType: string) {
        return (itemType in this._itemTypeList);
    }
}

export default TFactory;
export {
    IItemTypeEntry,
    TFactoryItemClass
}