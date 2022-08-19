/* *******************************************************************
 * Copyright (c) IoTWare, 2018
 * Licensed under the MIT License. See License.txt in the project root
 * Author: Tamas Kovari (zakzag.dev@gmail.com)
 * *******************************************************************/

import { TNodeList } from '../node/NodeManager';
import * as Debug from './Debug';
import * as fs from 'fs';
import INode from "../node/NodeInterface";

/**
 * Prints a list of nodes to the debug console
 * @param nodeList
 * @param root
 * @param tabs
 */
function printNodeList(
    nodeList: TNodeList,
    root: INode = null,
    tabs: number = 0
) {
    nodeList.forEach((node) => {
        printNode(node, 0);
    });
}

function printNode(root: INode, tabs) {
    /* tslint:disable: no-console */

    const spaces = '|  '.repeat(tabs);
    Debug.info(`${spaces}|`);
    Debug.info(`${spaces}+ ${root.name}@${root.type}#${root.uid}`);
    /* tslint:enable: no-console */
}

/* TODO: more details please! */
function printNodeDetails(root: INode) {
    Debug.info(`${root.name}@${root.type}#${root.uid}`);
}

function printNodes(nodes: INode[]) {
    nodes.forEach(this.printNode);
}

function printNodeToFile(node: INode) {
    fs.writeFileSync(
        './node-' + node.uid.split(':').join(''),
        JSON.stringify(
            {
                name: node.name,
                uid: node.uid,
                type: node.type,
                lastUpdate: node.lastUpdate,
                props: node.props,
                state: node.state,
                stateHistory: node.stateHistory
            },
            null,
            4
        )
    );
}

export {
    printNodeList,
    printNodeDetails,
    printNode,
    printNodes,
    printNodeToFile
};
