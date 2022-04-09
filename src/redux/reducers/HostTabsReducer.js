import {
    ADD_HOST_TAB,
    REMOVE_HOST_TAB,
    ACTIVE_HOST_TAB,
    REMOVE_HOST_TAB_BY_TYPE,
} from "@/redux/constants/HostTabsActionType";
import { HOST_TAB_REMOVE_TYPE } from "@/utils/constant";
//初始化状态
let initialState = {
    activeKey: "1",
    tabs: [],
};
/**
 * 删除tab
 *
 * @param {*} state
 * @param {*} targetKey
 * @returns
 */
function removeHostTab(state, targetKey) {
    let { tabs, activeKey } = state;
    let lastIndex;
    tabs.forEach((tab, i) => {
        if (tab.key === targetKey) {
            lastIndex = i - 1;
        }
    });
    const tabsTmp = tabs.filter((tab) => tab.key !== targetKey);
    if (tabsTmp.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
            activeKey = tabsTmp[lastIndex].key;
        } else {
            activeKey = tabsTmp[0].key;
        }
    }
    return { activeKey: activeKey, tabs: tabsTmp };
}
/**
 *根据type删除tab
 *
 * @param {*} state
 * @param {*} removeType
 * @returns
 */
function removeHostTabByType(state, removeType) {
    let { tabs, activeKey } = state;
    let tabsTmp = tabs;
    let currentIndex = 0;
    if (removeType === HOST_TAB_REMOVE_TYPE.RIGHT) {
        let sliceIndex = -1;
        tabs.forEach((tab, i) => {
            if (tab.key === activeKey) {
                sliceIndex = i;
            }
        });
        if (sliceIndex !== -1) {
            tabsTmp = tabs.slice(0, sliceIndex + 1);
            currentIndex = sliceIndex;
        }
    } else if (removeType === HOST_TAB_REMOVE_TYPE.LEFT) {
        let sliceIndex = -1;
        tabs.forEach((tab, i) => {
            if (tab.key === activeKey) {
                sliceIndex = i;
            }
        });
        if (sliceIndex !== -1) {
            tabsTmp = tabs.slice(sliceIndex, tabs.length);
            currentIndex = 0;
        }
    } else if (removeType === HOST_TAB_REMOVE_TYPE.OTHER) {
        tabsTmp = tabs.filter((tab) => tab.key === activeKey);
        currentIndex = 0;
    }
    if (tabsTmp.length > 0) {
        if (currentIndex >= 0) {
            activeKey = tabsTmp[currentIndex].key;
        } else {
            activeKey = tabsTmp[0].key;
        }
    } else {
        activeKey = "";
    }
    return { activeKey: activeKey, tabs: tabsTmp };
}

const HostTabsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_HOST_TAB:
            let item = state.tabs.find((item) => {
                return item.key === action.payload.node.key;
            });
            if (item === null || item === undefined) {
                state.tabs.push({
                    title: action.payload.node.title,
                    content: action.payload.node.title,
                    key: action.payload.node.key,
                    closable: action.payload.node.closable,
                    node: action.payload.node,
                });
            }
            return { ...state };
        case REMOVE_HOST_TAB:
            let stateTmp1 = removeHostTab(state, action.payload.targetKey);
            state.activeKey = stateTmp1.activeKey;
            state.tabs = stateTmp1.tabs;
            return { ...state };
        case REMOVE_HOST_TAB_BY_TYPE:
            let stateTmp2 = removeHostTabByType(
                state,
                action.payload.removeType
            );
            state.activeKey = stateTmp2.activeKey;
            state.tabs = stateTmp2.tabs;
            return { ...state };
        case ACTIVE_HOST_TAB:
            return { ...state, activeKey: action.payload.activeKey };
        default:
            //如果类型为匹配到 返回当前state
            return { ...state };
    }
};
export default HostTabsReducer;
