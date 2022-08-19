/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { Constructor } from "../util/Util";

interface IInjectable {
    inject(diConfig: object): this;
} 

function TInjectable<TBase extends Constructor>(Base: TBase) {
    return class extends Base implements IInjectable {
        constructor(...params: any[]) {
            super(...params);
        }

        /**
         * Injects dependencies to the object using config object. 
         * Config object has all the dependencies, as object properties
         * This method will extend "this" with these properties with some
         * modification. They will get an underscore before their names
         * like "db" -> "_db"
         * 
         * @param diConfig the config object, that has all the dependencies
         */
        public inject(diConfig: object): this {
            for (let key in diConfig) {
                if ((diConfig).hasOwnProperty(key)) {
                    (<object>this)[`_${key}`] = diConfig[key];
                }
            }

            return this;
        }
    }
}

export default TInjectable;

export { 
    IInjectable
}