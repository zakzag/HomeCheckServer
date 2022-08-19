/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/


/**
 * @description Observable mixin for classes that need trigger events, and able to have subscribers
 *              It realizes the basic standard observable pattern like adding, removing events,
 *              trigger events and call subscribed callbacks
 *              It triggers event that was defined earlied using addEventType or addEventTypes
 *              These methods triggers only Events derived from TEvent class.
 */
import { Constructor } from "../util/Util";
import TEventEmitter from "../event/EventEmitter";
import TEvent from "../event/Event";
import ICallback from "../event/EventCallback";
import * as Debug  from "../util/Debug";
import { DevelopmentError } from '../error/ErrorConstants';

interface IObservable {
    /**
     * Adds a new event type to the accepted events list, once added, the corresponding
     * class will be able to trigger it.
     *
     * @param {string} name   The name of the event
     * @returns {this}
     */
    addEventType<EventType extends TEvent>(name: string): this;

    /**
     * Adds a list of new events to the accepted events list @see addEventType above
     *
     * @param {string} eventTypeList  Event list
     * @returns {this}
     */
    addEventTypes(...eventTypeList: string[]): this;

    /**
     * Returns true if the event type is already
     * @param {string} eventType
     * @returns {boolean}
     */
    hasEventType(eventType: string): boolean;

    /**
     * Subscribes to an event
     *
     * @param {string} eventType
     * @param {ICallback<TEvent>} callback
     * @returns {this}
     */
    on(eventType: string, callback: ICallback<TEvent>): this;

    /**
     * Unsubscribes from an event. Callback reference must be the same as the subscribed one
     * otherwise nothing happens
     *
     * @param {string} eventType
     * @param {ICallback<TEvent>} callback
     * @returns {this}
     */
    off(eventType: string, callback: ICallback<TEvent>): this;

    /**
     * Fires/triggers an event on the corresponding object
     *
     * @param {TEvent} message
     * @returns {this}
     */
    trigger(message: TEvent): this;
}

function TObservable<TBase extends Constructor>(Base: TBase) {
    return class extends Base implements IObservable {

        /**
         * _eventHandlerMap is a list of EventEmitters bound to a specific event type. Each EventEmitter manages
         * only one event type.
         */
        private _eventHandlerMap: { [name: string]: TEventEmitter<any> };

        constructor(...params: any[]) {
            super(...params);
            this._eventHandlerMap = {};
        }

        public addEventType(name: string): this {
            if (this.hasEventType(name)) {
                throw new DevelopmentError(`Event type "${name}" already exists.`);
            }
            else {
                this._eventHandlerMap[name] = new TEventEmitter(name);
            }

            return this;
        }

        public addEventTypes(...eventTypeList: string[]): this {
            eventTypeList.forEach((eventType: string) => {
                this.addEventType(eventType);
            });

            return this;
        }

        hasEventType(eventType: string): boolean {
            return this._eventHandlerMap[eventType] instanceof Object;
        }

        public on(eventType: string, callback: ICallback<TEvent>): this {
            let eventHandler = this._eventHandlerMap[eventType];
            if (eventHandler) {
                eventHandler.add(callback)
            } else {
                Debug.warn(`WARNING: event type '${eventType}' does not exist on class '${this.constructor.name}', `+
                    `please check mistyping or add it by using addEventType`);
            }

            return this;
        }

        public off(eventType: string, callback: ICallback<TEvent>): this {
            this._eventHandlerMap[eventType].remove(callback);

            return this;
        }

        public trigger(event: TEvent): this {
            const eventHandlers = this._eventHandlerMap[event.type];
            if (eventHandlers) {
                eventHandlers.trigger(event);
            } else {
                Debug.warn(`WARNING: event type `,event.type,` does not exist on class `+
                    `'${this.constructor.name}', please check mistyping or add it by using addEventType`);
                // tslint:disable-next-line: no-console
                Debug.warn(console.trace());
            }
            return this;
        }
    }
}

export default TObservable;

export {
    IObservable
 }