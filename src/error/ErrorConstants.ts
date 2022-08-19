/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   
import HCError from './HCError';
import {TAnyObj} from "../util/Types";

export interface SubscribeErrorObject {
    error: Error,
    topic: string,
    payload: TAnyObj
}

/* Base HC Errors */
export class DBError extends HCError { name = "DBError"; }
export class NodeError extends HCError { name = "NodeError"; }
export class ValidationError extends HCError { name = "ValidationError"; }
export class UnknownTypeError extends HCError { name = "UnknownTypeError"; }
export class DevelopmentError extends HCError { name = "DevelopmentError"; }
export class RuntimeError extends HCError { name = "RuntimeError"; }

/* Derived Errors */
export class ConfigError extends ValidationError { name = "ConfigError"; }

export class BoundaryError extends RuntimeError { name = "BoundaryError"; }
export class InvalidUIDError extends RuntimeError { name = "InvalidUIDError"; }

export class DBInconsistencyError extends DBError { name = "DBInconsistencyError"; }

export class InvalidNodeError extends NodeError { name = "InvalidNodeError"; }
export class InvalidNodeStateError extends NodeError { name = "InvalidNodeStateError"; }
export class InvalidNodePropsError extends NodeError { name = "InvalidNodePropsError"; }
export class NodeRemoveError extends NodeError { name = "NodeRemoveError"; }