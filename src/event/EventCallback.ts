/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   
import TEvent from "./Event";

interface ICallback<M extends TEvent> {
    (message: M): void
}

export default ICallback;