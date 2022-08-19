/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   
import TEvent from "./Event";
import TFactory, {TFactoryItemClass} from "../Factory";
import {DevelopmentError} from "../error/ErrorConstants";
import * as Debug from "../util/Debug";

class TEventFactory extends TFactory<TEvent> {
    constructor() {
        super();
    }

    public register(itemClass: TFactoryItemClass<TEvent>): this {
        let itemType: string = (itemClass as unknown as TEvent).type;

        Debug.detail(`Registering: '${itemType} for ${(itemClass as any).name}`);

        if (this.isRegisteredType(itemType)) {
            throw new DevelopmentError(`Item Type "${itemType}" is already registered`);
        }

        this._itemTypeList[itemType] = {
            itemType: itemType,
            itemClass: itemClass
        };

        return this;
    }
}

let EventFactory: TEventFactory = new TEventFactory();

export default EventFactory;

export {
    TEventFactory
}
