/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root 
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/
   
import TFactory from "../Factory";
import TCommand from './Command';

class TCommandFactory extends TFactory<TCommand<any>> {}

let CommandFactory: TCommandFactory = new TCommandFactory();

export default CommandFactory;

export {
    TCommandFactory
}
