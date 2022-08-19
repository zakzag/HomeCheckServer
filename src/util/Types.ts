import { Runtype } from 'runtypes';
import {ValidationError} from "../error/ErrorConstants";
/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

type TAnyObj = { [name: string]: any };
type TRunTypeList = { [name: string]: Runtype };

/* @TODO: change to the corresponding types */
/**
 * Check data against Schema. Returns data object, if it passes runtime typecheck 
 * and it has all the fields and strictly only those fields that schema has.
 * Otherwise it throws a ValidationError.
 * 
 * @param Schema 
 * @param data 
 */
function checkStrict<T = TAnyObj>(Schema: TAnyObj, data: T): T {
    Schema.check(data);
    return checkFields(Schema, data);
}

 /**
  * Check data object against Schema by checking if all the fields...
  * 
  * @TODO: Megcsinalni rekurzivan ha lehet, mert csak 1 szintre mukodik!
  * 
  * @param schema 
  * @param data 
  */
function checkFields<T = TAnyObj>(schema: TAnyObj, data: T): T {
    let invalidFields: string[] = [];

    const keys: string[] = getSchemaKeys(schema, true);

    let isValid = Object.keys(data).reduce((prev, key) => {
        const thisOneIsValid: boolean = keys.includes(key);
        if (!thisOneIsValid) {
            invalidFields.push(key);
        }
        return thisOneIsValid && prev
    }, true);

    if (!isValid) {
        const invalidFieldList = invalidFields.join("', '");
        throw new ValidationError(`object has invalid fields: '${invalidFieldList}'`);
    }

    return data;
}

/**
 * Returns all fields from a schema, traversing the whole tree (required and partial branches)
 * 
 * @param schema   The Schema to get fields from
 * @param all      Get all field or required only
 * 
 * TEST MISSING
 */
function getSchemaKeys(schema, all: boolean = false): string[] {
    if (schema.fields) {
        return Object.keys(schema.fields);
    } else if(Array.isArray(schema.intersectees)) {
        return schema.intersectees.reduce((last: Array<any>, subSchema: any) => {
            if (all == true || subSchema.tag == "record") {
                return [...last, ...getSchemaKeys(subSchema)];
            } else {
                return last;
            }
        }, []);
    } else {
        return [];
    }
    
}

export {
    checkFields,
    checkStrict,
    getSchemaKeys,
    TAnyObj,
    TRunTypeList,
}
