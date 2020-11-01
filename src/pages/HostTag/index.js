import React, { Component } from "react";
import HostContent from "@/pages/HostContent";
import HostTerminal from "@/pages/HostTerminal";
import HostUrl from "@/pages/HostUrl";
import { Tabs, Menu, Dropdown } from "antd";
import { connect } from "react-redux";
import {
    activeHostTab,
    removeHostTab,
    removeHostTabByType,
} from "@/redux/actions/HostTabsAction";
import { OPEN_TAB_TYPE, HOST_TAB_REMOVE_TYPE } from "@/utils/constant";
import intl from "react-intl-universal";
const { TabPane } = Tabs;
/**
 * HOST-TAB管理
 *
 * @class HostContent
 * @extends {Component}
 */

class HostTag extends Component {
    onTabClick = (activeKey) => {
        this.props.activeHostTab(activeKey);
    };
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };
    remove = (targetKey) => {
        this.props.removeHostTab(targetKey);
    };
    clickHostTagMenu = (item) => {
        this.props.removeHostTabByType(item.key);
    };
    /**
     * HostTagMenu
     */
    HostTagMenu = (
        <Menu onClick={this.clickHostTagMenu.bind(this)}>
            <Menu.Item key={HOST_TAB_REMOVE_TYPE.RIGHT}>
                {intl.get("HostTag.Menu.remove.rigth")}
            </Menu.Item>
            <Menu.Item key={HOST_TAB_REMOVE_TYPE.LEFT}>
                {intl.get("HostTag.Menu.remove.left")}
            </Menu.Item>
            <Menu.Item key={HOST_TAB_REMOVE_TYPE.OTHER}>
                {intl.get("HostTag.Menu.remove.other")}
            </Menu.Item>
        </Menu>
    );
    /**
     * HostTagMenuDropdown
     * @param {*} obj
     */
    HostTagMenuDropdown = (obj) => (
        <Dropdown overlay={this.HostTagMenu} trigger={["contextMenu"]}>
            <span style={{ userSelect: "none" }}>{obj}</span>
        </Dropdown>
    );
    render() {
        return (
            <div>
                <Tabs
                    onTabClick={this.onTabClick}
                    hideAdd="true"
                    activeKey={this.props.hostTabsReducer.activeKey}
                    type="editable-card"
                    onEdit={this.onEdit}
                >
                    {this.props.hostTabsReducer.tabs.map((tab) => (
                        <TabPane
                            tab={this.HostTagMenuDropdown(tab.title)}
                            key={tab.key}
                            style={{ background: "#fff" }}
                        >
                            <div
                                style={{
                                    height: "90vh",
                                }}
                            >
                                {tab.node.type === OPEN_TAB_TYPE.CONN ||
                                tab.node.type === OPEN_TAB_TYPE.CONN_MUTI ? (
                                    <HostContent node={tab.node}></HostContent>
                                ) : (
                                    ""
                                )}
                                {tab.node.type ===
                                OPEN_TAB_TYPE.CONN_TERMINAL ? (
                                    <HostTerminal
                                        node={tab.node}
                                        title={tab.title}
                                    ></HostTerminal>
                                ) : (
                                    ""
                                )}
                                {tab.node.type === OPEN_TAB_TYPE.URL ? (
                                    <HostUrl
                                        node={tab.node}
                                        title={tab.title}
                                    ></HostUrl>
                                ) : (
                                    ""
                                )}
                            </div>
                        </TabPane>
                    ))}
                </Tabs>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        hostTabsReducer: state.hostTabsReducer,
    };
};
export default connect(mapStateToProps, {
    activeHostTab,
    removeHostTab,
    removeHostTabByType,
})(HostTag);
