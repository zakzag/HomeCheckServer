/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

/** @TODO: IMPORTANT: remove state and PROPS from Node to a mixin! */

import {TObservable, TInjectable} from '../mixin/mixins';
import IMessageBroker from '../service/message/MessageBrokerInterface';
import {IDBNodeService} from '../service/db/DBService';
import {EVENT} from '../event/EventConstants';
import EventFactory from '../event/EventFactory';
import {TAnyObj} from '../util/Types';
import {
    DBInconsistencyError,
    DevelopmentError, RuntimeError
} from '../error/ErrorConstants';
import INode from './NodeInterface';
import {extend, shallowCopy} from '../util/Util';
import TNodeState, {INodeState} from './NodeState';
import TNodeProps, {INodeProps} from './NodeProps';
import {
    NodePropsSchema,
    NodeStateSchema,
} from '../schema/schemas';
import {TNodeFailureEvent, TNodePropsChangeEvent} from "./NodeEvents";
import {gotParamsFailure, gotStateError, gotStateFailure, gotTraitFailure, hasParamsChanged} from "../util/ParamUtils";
import {IStatusType} from "../schema/StatusTypeSchema";
import {TNodeErrorEvent} from "./event/NodeErrorEvent";

interface INodeDIConfig {
    messageBroker: IMessageBroker;
    db: IDBNodeService;
}

interface INodeConfig {
    props?: INodeProps;
    state?: INodeState;
}

interface INodePartialConfig {
    props?: Partial<INodeProps>;
    state?: Partial<INodeState>;
}

class TNode extends TInjectable(TObservable(class TBaseNode {
})) implements INode {
    /* References */
    protected _messageBroker: IMessageBroker;
    protected _db: IDBNodeService;

    /* State */
    protected _state: INodeState;
    protected _prevState: INodeState;
    protected _stateHistory: INodeState[];
    protected _props: INodeProps;
    protected _prevProps: INodeProps;
    protected _defaultState: TNodeState;
    static readonly _defaultConfig = {
        props: TNodeProps.defaultProps,
        state: TNodeState.defaultState
    }

    /**
     * Validators for Node
     */
    protected static _propsSchema: Record<any, any> = NodePropsSchema;
    protected static _stateSchema: Record<any, any> = NodeStateSchema;

    constructor(config: INodeConfig = TNode._defaultConfig) {
        super();

        this.initEvents();
        this.initProps(config.props);
        this.initState(config.state);
    }

    /**
     * This must be called after setting props and state, as
     * this method will setup everything, inject dependencies
     * @param config  dependency injection object
     */
    public setup(config: INodeDIConfig): this {
        super.inject(config);

        if (!this._messageBroker || !this._db) {
            throw new DevelopmentError(
                `Device#${this.uid} has no dependency set`
            );
        }

        return this;
    }

    protected initState(state: INodeState) {
        this._state = TNodeState.create(state);
        this._prevState = TNodeState.create();
        this._defaultState = TNodeState.create();
        this._stateHistory = [];
    }

    protected initProps(props: INodeProps) {
        this._props = TNodeProps.create(props);

        this._prevProps = TNodeProps.create();
    }

    protected initEvents() {
        this.addEventTypes(
            EVENT.NODE_STATE_UPDATE,
            EVENT.NODE_PROPS_UPDATE,
            EVENT.NODE_PARAMS_UPDATE,
            EVENT.NODE_FAILURE,
            EVENT.NODE_ERROR,
            EVENT.NODE_STATE_RECEIVE,
            EVENT.NODE_INFO_RECEIVE
        );
    }

    /**
     * Load properties and state from persistent storage
     *
     * @return Promise
     */
    public async loadAll(): Promise<void> {
        await this.loadState();
        await this.loadProps();
        await this.loadStateHistory();
    }

    /**
     * Load State from persistent storage
     *
     * @return Promise
     */
    public async loadState(): Promise<INodeState> {
        const state = await this._db.loadState(this.uid);
        this.setState(state);

        return state;
    }

    /**
     * load StateHistory from database
     */

    /* @TODO: replace with 1 param called loadParams?, not 4 params */
    public async loadStateHistory(
        filter?: TAnyObj,
        limit?: number,
        skip?: number
    ): Promise<INodeState[]> {
        /* @TODO: filtering, and limit and skip! pass to the database*/
        this._stateHistory = await this._db.loadStates(this.uid);

        // theoretically there's no chance to have no state
        if (this.stateHistory.length <= 0) {
            throw new DBInconsistencyError(
                `Node #${this.uid}(${this.type}.${this.name}) has no state present`
            );
        }

        return this.stateHistory;
    }

    /**
     * Load Properties from persistent storage
     *
     * @return Promise
     */
    public async loadProps(): Promise<INodeProps> {
        const result = await this._db.loadProps(this.uid);
        this._props = result;
        return result;
    }

    /**
     * Save state to persistent storage
     *
     * @return Promise
     */
    public async insertState(): Promise<any> {
        this._stateHistory.push(this.state);
        return await this._db.insertState(this.uid, this.state);
    }

    /**
     * Save properties to persistent storage
     *
     * @return Promise
     */
    public async saveProps(): Promise<any> {
        return await this._db.saveProps(this.props);
    }

    /**
     * Save both properties and state to persistant storage
     * StateHistory
     *
     * @return Promise
     */
    public async saveAll(): Promise<any> {
        await this.insertState();
        await this.saveProps();
    }

    public get name(): string {
        return this.props.name;
    }

    public get type(): string {
        return this.props.type;
    }

    public get uid(): string {
        return this.props.uid;
    }

    public get enabled() {
        return this.props.enabled;
    }


    public set enabled(value: boolean) {
        this.props.enabled = value;
        this.saveProps();
    }

    /**
     * Returns current state of the node
     */
    get state(): INodeState {
        return this._state;
    }

    /**
     * Setter for state. This will not overwrite previous state but creates a copy of it
     * and overwrites with provided state, so it will contain a merge of the previous
     * and the provided state.
     */
    // @TODO: make it async!
    setState(state: INodeState): INodeState {
        NodeStateSchema.check(state);

        if (gotStateError(state, this.state)) {
            this.trigger(new TNodeErrorEvent({ state }, { uid: this.uid }));
        }

        if (gotStateFailure(state, this.state)) {
            this.trigger(new TNodeFailureEvent({ state }, { uid: this.uid }));
        }

        if (gotTraitFailure(state, this.state)) {
            throw new RuntimeError(`Number of traits does not match with the previous state ${this.state.traits.length} - ${this.prevState.traits.length}`)
        }

        this._prevState = this.state;
        this._state = extend(this._state, state); // @TODO: deep copy?

        // @TODO: async!!!
        this.insertState().then(() => {
            this.trigger(
                EventFactory.create(EVENT.NODE_STATE_UPDATE, {
                    state: this.state,
                    prevState: this.prevState
                }, { })
            );
        });

        return state;
    }

    /**
     * Returns state history (list of previous states)
     */
    get stateHistory() {
        return this._stateHistory;
    }

    /**
     * Sets state history (list of previous states)
     */
    set stateHistory(value) {
        this._stateHistory = value;
    }

    public get status(): IStatusType {
        return this.state.status.status;
    }

    public set status(status: IStatusType) {
        this.state.status.status = status;
        // @TODO: save?
    }

    /**
     * Setter for props. Creates a new props and drops the previous one after copying
     * all the properties.
     */
    public setProps(props: Partial<INodeProps>): void {
        this._prevProps = shallowCopy(this._props);  // @TODO: do we really need shallowCopy or just extend?
        this._props = extend(this._props, props);

        this.trigger(new TNodePropsChangeEvent({
            props: this._props,
            prevProps: this._prevProps
        }, { uid: this.uid }));

        const prevParams = this._prevProps.params;
        const params = this._props.params;

        if (gotParamsFailure(params, prevParams)) {
            throw new RuntimeError('Params mismatch error');
        }

        if (prevParams.length > 0 && params.length > 0 && hasParamsChanged(params, prevParams)) {
            this.trigger(EventFactory.create(EVENT.NODE_PARAMS_UPDATE, {
                params,
                prevParams
            }, { uid: this.uid }));
        }
    }

    get props(): INodeProps {
        return this._props;
    }

    get prevProps(): INodeProps {
        return this._prevProps;
    }

    get prevState(): INodeState {
        return this._prevState;
    }

    get lastUpdate(): number {
        return this.state?.timestamp;
    }
}

export default TNode;
export {INodeConfig, INodePartialConfig, INodeDIConfig};
