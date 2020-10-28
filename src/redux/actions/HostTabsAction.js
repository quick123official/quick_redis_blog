import {
    ACTIVE_HOST_TAB,
    REMOVE_HOST_TAB,
    ADD_HOST_TAB,
    REMOVE_HOST_TAB_BY_TYPE,
} from "@/redux/constants/HostTabsActionType";

/**
 *激活
 *
 * @param {*} key
 * @returns
 */
export function activeHostTab(activeKey) {
    return { type: ACTIVE_HOST_TAB, payload: { activeKey: activeKey } };
}
/**
 *删除 host tab
 *
 * @export
 * @param {*} hostKey
 * @returns
 */
export function removeHostTab(targetKey) {
    return { type: REMOVE_HOST_TAB, payload: { targetKey: targetKey } };
}
/**
 *根据type删除tab
 *
 * @export
 * @param {*} hostKey
 * @returns
 */
export function removeHostTabByType(removeType) {
    return {
        type: REMOVE_HOST_TAB_BY_TYPE,
        payload: { removeType: removeType },
    };
}

/**
 *添加 host tab
 *
 * @export
 * @param {*} node
 * @returns
 */
export function addHostTab(node) {
    return { type: ADD_HOST_TAB, payload: { node: node } };
}
