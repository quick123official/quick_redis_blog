import {
    GET_HOSTS_DATA,
    DEL_HOSTS_DATA,
    ADD_HOSTS_DATA,
    MODIFY_HOSTS_DATA,
    MODIFY_HOSTS_POSITION,
} from "@/redux/constants/HostDataActionType";

import uuid from "node-uuid";
import HostsFileService from "@/services/HostsFileService";
//初始化状态
let initialState = {
    hosts: [],
};
/**
 *删除节点。返回1表示删除成功
 *
 * @param {*} nodeList
 * @param {*} nodeName
 * @returns
 */
function delHostsByNodeName(nodeList = [], key = "") {
    if (Object.keys(nodeList).length === 0 || nodeList.length === 0) {
        // 空对象或者空串，直接返回
        return 0;
    }
    let index = nodeList.findIndex((node) => node.key === key);
    if (index !== -1) {
        // 命中，则删除
        let retNode = nodeList[index];
        nodeList.splice(index, 1);
        return retNode;
    }
    for (let i = 0; i < nodeList.length; i++) {
        let node = nodeList[i];
        if (!node.isLeaf) {
            let retObj = delHostsByNodeName(node.children, key);
            if (retObj !== null) {
                return retObj;
            }
        }
    }
    return null;
}
/**
 *新增node
 *
 * @param {*} children
 * @param {*} key
 * @param {*} node
 * @returns
 */
function addHostsData(children, key, node) {
    if (typeof key === "undefined") {
        children.push(node);
    } else {
        for (let c of children) {
            if (!c.isLeaf) {
                if (c.key === key) {
                    if (node.isLeaf) {
                        c.children.unshift(node);
                    } else {
                        c.children.push(node);
                    }
                } else {
                    addHostsData(c.children, key, node);
                }
            } else if (c.key === key) {
                children.push(node);
                return;
            }
        }
    }
}
/**
 *修改node
 *
 * @param {*} children
 * @param {*} node
 * @returns
 */
function modifyHostsData(children, node) {
    for (let cNode of children) {
        if (cNode.key === node.key) {
            cNode = node;
        }
        if (!cNode.isLeaf) {
            modifyHostsData(cNode.children, node);
        }
    }
}
/**
 *修改host的位置
 *
 * @param {*} children
 * @param {*} node
 * @returns
 */
function modifyHostPosition(nodeList = [], sourceKey, targetKey) {
    let sourceNode = delHostsByNodeName(nodeList, sourceKey);
    addHostsData(nodeList, targetKey, sourceNode);
}

const HostDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_HOSTS_DATA:
            //处理 类型为 GET_HOSTS_DATA 结果数据
            return { ...state, hosts: action.payload };
        case DEL_HOSTS_DATA:
            let keys = action.payload;
            for (let key of keys) {
                delHostsByNodeName(state.hosts, key);
            }
            state.hosts = Object.assign([], state.hosts);
            HostsFileService.saveHostsDataByNode(state.hosts);
            return { ...state, hosts: state.hosts };
        case ADD_HOSTS_DATA:
            //处理 类型为 ADD_HOSTS_DATA 结果数据
            action.payload.node.key = uuid.v4();
            addHostsData(state.hosts, action.payload.key, action.payload.node);
            state.hosts = Object.assign([], state.hosts);
            // 保存数据
            HostsFileService.saveHostsDataByNode(state.hosts);
            return { ...state, hosts: state.hosts };
        case MODIFY_HOSTS_DATA:
            //处理 类型为 MODIFY_HOSTS_DATA 结果数据
            modifyHostsData(state.hosts, action.payload.node);
            // 保存数据
            HostsFileService.saveHostsDataByNode(state.hosts);
            return { ...state, hosts: state.hosts };
        case MODIFY_HOSTS_POSITION:
            //处理 类型为 MODIFY_HOSTS_POSITION 结果数据
            let sourceKey = action.payload.sourceKey;
            let targetKey = action.payload.targetKey;
            modifyHostPosition(state.hosts, sourceKey, targetKey);
            state.hosts = Object.assign([], state.hosts);
            // 保存数据
            HostsFileService.saveHostsDataByNode(state.hosts);
            return { ...state, hosts: state.hosts };
        default:
            //如果类型为匹配到 返回当前state
            return state;
    }
};
export default HostDataReducer;
