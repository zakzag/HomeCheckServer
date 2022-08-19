/**
 * true when current trait list consists differet traits than the previous one.
 *
 * @returns {boolean}
 */
import {INodeState} from "../node/NodeState";
import {STATUS} from "../node/NodeConstants";
import {IParam, IParamList} from "../schema/ParamSchema";
import {TParamObject} from "../schema/ParamMapSchema";

function gotTraitFailure(state: INodeState, prevState: INodeState): boolean {
    return state.traits.length != prevState.traits.length && prevState.traits.length !== 0;
}


/**
 * Returns true when error occured (and there was no error before)
 *
 * @param {INodeState} state     The current state occured
 * @param {INodeState} prevState The previous state of the node
 * @returns {boolean}
 */
function gotStateError(state: INodeState, prevState: INodeState): boolean {
    return (prevState.status.errorCode === "0" && state.status.errorCode !== "0");
}

/**
 * Returns true when unrecoverable error (failure) occured (and there was no error before)
 *
 * @param {INodeState} state     The current state occured
 * @param {INodeState} prevState The previous state of the node
 * @returns {boolean}
 */
function gotStateFailure(state: INodeState, prevState: INodeState): boolean {
    return ((prevState.status.status !== STATUS.FAILURE) && (state.status.status === STATUS.FAILURE));
}

/**
 * Returns true, when number of params and names are mismatch from the previous
 */
function gotParamsFailure(params: IParamList, prevParams: IParamList) {
    const paramsMap = convertParamListToObject(params);
    const prevParamsMap = convertParamListToObject(prevParams);

    /* When there's no params it can mean 2 things:
     * - this is the first setProps call
     * - this device does not have props at all
     * @TODO: It can happen that zero params changes and won't throw error because of this line below! Review it!
     */
    if (prevParams.length == 0) {
        return false;
    }

    if (params.length !== prevParams.length) {
        return true;
    }

    for (let key in paramsMap) {
        // @TODO: it might fail if 2 arrays compared, please fix!
        if (!(prevParamsMap as Object).hasOwnProperty(key)) {
            return true;
        }
    }

    return false;
}

/**
 * Returns true, when any params has changed
 */
function hasParamsChanged(params: IParamList, prevParams: IParamList) {
    const paramsMap = convertParamListToObject(params);
    const prevParamsMap = convertParamListToObject(prevParams);

    for (let key in paramsMap) {
        // @TODO: it might fail if 2 arrays compared, please fix!
        if (!(paramsMap as Object).hasOwnProperty(key) ||
            (!(prevParamsMap as Object).hasOwnProperty(key)) ||
            (paramsMap[key] !== prevParamsMap[key])
        ) {
            return true;
        }
    }

    return false;
}


/**
 * Converts { name: string, value: string } to { name: value } map
 *
 * @param {IParamList} paramList
 * @returns {TParamObject}
 */
function convertParamListToObject(paramList: IParamList): TParamObject {
    return paramList.reduce<TParamObject>((prev: IParam, current: IParam) => {
        prev[current.name] = current.value;
        return prev;
    }, {});
}

/**
 * Converts { name: value } to { name: string, value: string }
 * Important: all values in result map obj will be string values,
 * all types of values will be converted to string
 *
 * @param {TParamObject} obj
 * @returns {IParamList}
 */
function convertObjectToParamList(obj: TParamObject): IParamList {
    let result: IParamList = [];

    for (let param in obj) {
        result.push({
            name: param,
            value: String(obj[param])
        });
    }
    return result;
}

/*const getParamKeys = (params: IParamList): string[] => {
    return params.map(item => item.name);
}*/

export {
    gotStateError,
    gotStateFailure,
    gotTraitFailure,
    gotParamsFailure,
    hasParamsChanged,
    convertParamListToObject,
    convertObjectToParamList
}
