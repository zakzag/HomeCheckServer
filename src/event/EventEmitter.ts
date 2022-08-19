/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   
import TEvent from "./Event";
import ICallback from "./EventCallback";

class TEventEmitter<EventType extends TEvent> {
    private _callbackList: ICallback<TEvent>[];
    private _eventType: string;

    constructor(eventType: string) {
        this._callbackList = [];
        this._eventType = eventType;
    }

    get eventType(): string {
        return this._eventType;
    }

    get callbacks(): ICallback<TEvent>[] {
        return this._callbackList;
    }

    add(callback: ICallback<TEvent>): this {
        this._callbackList.push(callback);

        return this;
    }

    remove(callback: ICallback<TEvent>): this {
        this._callbackList = this._callbackList.filter((currentCallback: ICallback<TEvent>) => {
            return currentCallback !== callback;
        });

        return this;
    }

    trigger(event: EventType): this {
        this._callbackList.forEach((callback: ICallback<TEvent>) => {
            callback(event);
        }, this);
        return this;
    }
}

export default TEventEmitter;