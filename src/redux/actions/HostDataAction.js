/**
 * @description: hosts文件action
 * @param {type}
 * @return:
 */

import {
    GET_HOSTS_DATA,
    DEL_HOSTS_DATA,
    ADD_HOSTS_DATA,
    MODIFY_HOSTS_DATA,
    MODIFY_HOSTS_POSITION,
} from "@/redux/constants/HostDataActionType";
import uuid from "node-uuid";
import HostsFileService from "@/services/HostsFileService";

/**
 * 生成key
 *
 * @param {*} nodes
 * @param {*} index
 */
function genHostsKey(nodes) {
    for (let node of nodes) {
        node.key = uuid.v4();
        if (!node.isLeaf) {
            genHostsKey(node.children);
        }
    }
}
/**
 *获取本地hosts数据
 *
 * @export
 * @returns
 */
export function getHostsData() {
    
    let hosts = JSON.parse(HostsFileService.getHostsData());
    genHostsKey(hosts);
    return { type: GET_HOSTS_DATA, payload: hosts };
}
/**
 * 删除hosts数据
 *
 * @export
 * @param {*} nodeNames
 * @returns
 */
export function delHostsData(nodeNames) {
    return { type: DEL_HOSTS_DATA, payload: nodeNames };
}
/**
 *增加hosts数据
 *
 * @export
 * @param {*} key
 * @param {*} node
 * @returns
 */
export function addHostsData(key, node) {
    return { type: ADD_HOSTS_DATA, payload: { key: key, node: node } };
}

/**
 *修改hosts数据
 *
 * @export
 * @param {*} key
 * @param {*} node
 * @returns
 */
export function modifyHostsData(node) {
    return { type: MODIFY_HOSTS_DATA, payload: { node: node } };
}

/**
 *修改host的位置
 *
 * @export
 * @param {*} sourceKey
 * @param {*} targetKey
 * @returns
 */
export function modifyHostPosition(sourceKey, targetKey) {
    return {
        type: MODIFY_HOSTS_POSITION,
        payload: { sourceKey: sourceKey, targetKey: targetKey },
    };
}
