import React, { Component } from "react";
import { Tree, Menu, Dropdown, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
    FolderAddTwoTone,
    EditTwoTone,
    DeleteTwoTone,
    CodeTwoTone,
    PlusSquareTwoTone,
    ApiTwoTone,
    CopyTwoTone,
} from "@ant-design/icons";
import {
    getHostsData,
    delHostsData,
    addHostsData,
    modifyHostsData,
    modifyHostPosition,
} from "@/redux/actions/HostDataAction";
import { addHostTab, activeHostTab } from "@/redux/actions/HostTabsAction";
import { HOSTS_TREEE_MENU_TYPE, OPEN_TAB_TYPE } from "@/utils/constant";
import { connect } from "react-redux";
import CreateOrUpdateFolderModal from "@/pages/ResourceTree/CreateOrUpdateFolderModal";
import CreateOrUpdateHostModal from "@/pages/ResourceTree/CreateOrUpdateHostModal";
import RedisService from "@/services/RedisService";
import Log from "@/services/LogService";
import uuid from "node-uuid";
import HostsFileService from "@/services/HostsFileService";
import intl from "react-intl-universal";
const { ipcRenderer } = window.require("electron");
const { DirectoryTree } = Tree;
// 选中的keys
let resourceTreeSelectKeys = [];
/**
 *资源管理树
 *
 * @class ResourceTree
 * @extends {Component}
 */
class ResourceTree extends Component {
    componentDidMount() {
        let node = {
            title: "Home",
            type: OPEN_TAB_TYPE.URL,
            closable: false,
        };
        this.openTabByType(node);
        // 渲染事件
        // 导入连接事件
        ipcRenderer.on("import-hosts-data", (event, arg) => {
            let hostsFilePath = arg;
            if (hostsFilePath) {
                let result =
                    HostsFileService.importHostsDataByHostFilePath(
                        hostsFilePath
                    );
                if (result) {
                    // 获取 redis hosts 数据
                    this.props.getHostsData();
                    event.sender.send("show-message", {
                        type: "info",
                        title: intl.get("common.notice"),
                        detail: intl.get("ResourceTree.import.success"),
                    });
                } else {
                    event.sender.send("show-message", {
                        type: "error",
                        title: intl.get("common.error"),
                        detail: intl.get("ResourceTree.import.fail"),
                    });
                }
            }
        });
        // 导出连接事件
        ipcRenderer.on("export-hosts-data", (event, arg) => {
            let exportHostsFilePath = arg;
            if (exportHostsFilePath) {
                let result =
                    HostsFileService.exportHostsDataToHostFilePath(
                        exportHostsFilePath
                    );
                if (result) {
                    // 获取 redis hosts 数据
                    this.props.getHostsData();
                    event.sender.send("show-message", {
                        type: "info",
                        title: intl.get("common.notice"),
                        detail: intl.get("ResourceTree.export.success"),
                    });
                } else {
                    event.sender.send("show-message", {
                        type: "error",
                        title: intl.get("common.error"),
                        detail: intl.get("ResourceTree.export.fail"),
                    });
                }
            }
        });
        // 重置连接事件
        ipcRenderer.on("clean-hosts-data", (event, arg) => {
            let result = HostsFileService.cleanHostsData();
            if (result) {
                // 获取 redis hosts 数据
                this.props.getHostsData();
                event.sender.send("show-message", {
                    type: "info",
                    title: intl.get("common.notice"),
                    detail: intl.get("ResourceTree.reset.success"),
                });
            } else {
                event.sender.send("show-message", {
                    type: "error",
                    title: intl.get("common.error"),
                    detail: intl.get("ResourceTree.reset.fail"),
                });
            }
        });
    }
    componentWillUnmount() {}
    state = {
        createOrUpdateFolderModal: {
            visible: false,
            type: 0,
            folderName: "",
            createOnRoot: false,
        },
        createOrUpdateHostModal: {
            visible: false,
            type: 0,
            data: {
                name: "",
                host: "",
                port: 6379,
                auth: "",
                connectType: "0",
                masterName: "",
                proxyuse: false,
                proxyhost: "",
                proxysshport: 22,
                proxyusername: "root",
                proxypassword: "root",
                proxysshkeypath: "",
            },
        },
    };
    constructor(props) {
        super(props);
        // 获取 redis hosts 数据
        this.props.getHostsData();
    }
    /**
     * 根据nodeName查找节点
     *
     * @param {*} nodeList
     * @param {*} nodeName
     * @returns
     * @memberof ResourceTree
     */
    findNodeByNodeKey(nodeList, key) {
        if (typeof nodeList === "undefined" || nodeList.length === 0) {
            // 空对象或者空串，直接返回 undefined
            return undefined;
        }
        let index = nodeList.findIndex((item) => item.key === key);
        if (index !== -1) {
            // 命中，则返回node
            return nodeList[index];
        }
        for (let i = 0; i < nodeList.length; i++) {
            let node = nodeList[i];
            if (node.isLeaf === false) {
                let retObj = this.findNodeByNodeKey(node.children, key);
                if (typeof retObj !== "undefined") {
                    return retObj;
                }
            }
        }
        return undefined;
    }
    /**
     * 点击菜单
     *
     * @param {*} item
     * @memberof ResourceTree
     */
    clickTreeRightClickMenu(item) {
        let menuType = parseInt(item.key);
        let keys = resourceTreeSelectKeys;
        if (menuType === HOSTS_TREEE_MENU_TYPE.CREATE_CONN) {
            this.setState({
                createOrUpdateHostModal: {
                    visible: true,
                    type: 0,
                    data: {
                        name: "",
                        host: "",
                        port: 6379,
                        auth: "",
                        connectType: "0",
                        masterName: "",
                        sentinelPassword: "",
                        proxyuse: false,
                        proxyhost: "",
                        proxysshport: 22,
                        proxyusername: "root",
                        proxypassword: "root",
                        proxysshkeypath: "",
                    },
                },
            });
        } else if (menuType === HOSTS_TREEE_MENU_TYPE.UPDATE_CONN) {
            //
            let retObj = this.findNodeByNodeKey(this.props.hosts, keys[0]);

            this.setState({
                createOrUpdateHostModal: {
                    visible: true,
                    type: 1,
                    data: {
                        ...retObj.data,
                        name: retObj.name,
                        host: retObj.data.host,
                        port: retObj.data.port,
                        auth: retObj.data.auth,
                        connectType: retObj.data.connectType,
                        masterName: retObj.data.masterName,
                        sentinelPassword: retObj.data.sentinelPassword,
                    },
                },
            });
        } else if (menuType === HOSTS_TREEE_MENU_TYPE.DEL_CONN) {
            this.deleteNode(keys);
        } else if (menuType === HOSTS_TREEE_MENU_TYPE.CREATE_FOLDER) {
            this.setState({
                createOrUpdateFolderModal: {
                    visible: true,
                    type: 0,
                    folderName: "",
                    createOnRoot: false,
                },
            });
        } else if (menuType === HOSTS_TREEE_MENU_TYPE.UPDATE_FOLDER) {
            let retObj = this.findNodeByNodeKey(this.props.hosts, keys[0]);
            this.setState({
                createOrUpdateFolderModal: {
                    visible: true,
                    type: 1,
                    folderName: retObj.title,
                    createOnRoot: false,
                },
            });
        } else if (menuType === HOSTS_TREEE_MENU_TYPE.DEL_FOLDER) {
            this.deleteNode(keys);
        } else if (menuType === HOSTS_TREEE_MENU_TYPE.DEL_ALL) {
            this.deleteNode(keys);
        } else if (menuType === HOSTS_TREEE_MENU_TYPE.CREATE_CONN_TERMINAL) {
            this.connectAndOpenTabByType(OPEN_TAB_TYPE.CONN_TERMINAL);
        } else if (menuType === HOSTS_TREEE_MENU_TYPE.CREATE_CONN_MUTI) {
            this.connectAndOpenTabByType(OPEN_TAB_TYPE.CONN_MUTI);
        } else if (menuType === HOSTS_TREEE_MENU_TYPE.DISCONNECT_CONN) {
            let node = this.findNodeByNodeKey(this.props.hosts, keys[0]);
            if (
                node != null &&
                node.redis !== null &&
                node.redis !== undefined
            ) {
                node.redis.disconnect();
            }
        } else if (menuType === HOSTS_TREEE_MENU_TYPE.CREATE_FOLDER_ON_ROOT) {
            this.setState({
                createOrUpdateFolderModal: {
                    visible: true,
                    type: 0,
                    folderName: "",
                    createOnRoot: true,
                },
            });
        } else if (menuType === HOSTS_TREEE_MENU_TYPE.COPY_CONN) {
            let retObj = this.findNodeByNodeKey(this.props.hosts, keys[0]);
            this.setState({
                createOrUpdateHostModal: {
                    visible: true,
                    type: 0,
                    data: {
                        ...retObj.data,
                        name: retObj.name,
                        host: retObj.data.host,
                        port: retObj.data.port,
                        auth: retObj.data.auth,
                        connectType: retObj.data.connectType,
                        masterName: retObj.data.masterName,
                        sentinelPassword: retObj.data.sentinelPassword,
                    },
                },
            });
        }
    }
    /**
     *删除节点
     *
     * @param {*} keys
     * @memberof ResourceTree
     */
    deleteNode(keys) {
        let titles = [];
        for (let k of keys) {
            let retObj = this.findNodeByNodeKey(this.props.hosts, k);
            titles.push(retObj.title);
        }
        let { confirm } = Modal;
        confirm({
            title: intl.get("ResourceTree.delete.notice"),
            icon: <ExclamationCircleOutlined />,
            content: "" + titles,
            onOk: () => {
                this.props.delHostsData(keys);
                resourceTreeSelectKeys = [];
            },
            onCancel() {},
        });
    }
    /**
     * 显示右键菜单
     *
     * @returns
     * @memberof ResourceTree
     */
    showTreeRightClickMenu() {
        let keys = resourceTreeSelectKeys;
        // 0:新建连接;1:修改连接;2:删除连接;3:新建目录;4:修改目录;5:删除目录;6:删除;7:打开命令行;8:打开新窗口;9:断开连接;10:新建根目录;11:复制链接
        let showMenuItem = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        showMenuItem[HOSTS_TREEE_MENU_TYPE.CREATE_FOLDER_ON_ROOT] = 1;
        if (typeof keys === "undefined") {
            showMenuItem[HOSTS_TREEE_MENU_TYPE.CREATE_CONN] = 1;
            showMenuItem[HOSTS_TREEE_MENU_TYPE.CREATE_FOLDER] = 1;
        } else {
            let nodeTypeList = [];
            for (let i = 0; i < keys.length; i++) {
                let node = this.findNodeByNodeKey(this.props.hosts, keys[i]);
                if (node == null || typeof node === "undefined") {
                    continue;
                }
                nodeTypeList.push(node.isLeaf);
                if (nodeTypeList.length >= 2) {
                    break;
                }
            }
            if (nodeTypeList.length === 2) {
                // 选择了多个类型的节点
                showMenuItem[HOSTS_TREEE_MENU_TYPE.DEL_ALL] = 1;
            } else if (nodeTypeList.length === 1) {
                let nodeType = nodeTypeList[0];
                if (nodeType === false) {
                    // 文件夹
                    showMenuItem[HOSTS_TREEE_MENU_TYPE.CREATE_CONN] = 1;
                    showMenuItem[HOSTS_TREEE_MENU_TYPE.CREATE_FOLDER] = 1;
                    showMenuItem[HOSTS_TREEE_MENU_TYPE.UPDATE_FOLDER] = 1;
                    showMenuItem[HOSTS_TREEE_MENU_TYPE.DEL_FOLDER] = 1;
                } else {
                    // 连接
                    showMenuItem[HOSTS_TREEE_MENU_TYPE.CREATE_CONN] = 1;
                    showMenuItem[HOSTS_TREEE_MENU_TYPE.CREATE_FOLDER] = 1;
                    showMenuItem[HOSTS_TREEE_MENU_TYPE.UPDATE_CONN] = 1;
                    showMenuItem[HOSTS_TREEE_MENU_TYPE.DEL_CONN] = 1;
                    showMenuItem[
                        HOSTS_TREEE_MENU_TYPE.CREATE_CONN_TERMINAL
                    ] = 1;
                    showMenuItem[HOSTS_TREEE_MENU_TYPE.CREATE_CONN_MUTI] = 1;
                    showMenuItem[HOSTS_TREEE_MENU_TYPE.DISCONNECT_CONN] = 1;
                    showMenuItem[HOSTS_TREEE_MENU_TYPE.COPY_CONN] = 1;
                }
            } else {
                // 没有选择节点
                showMenuItem[HOSTS_TREEE_MENU_TYPE.CREATE_FOLDER] = 1;
                showMenuItem[HOSTS_TREEE_MENU_TYPE.CREATE_CONN] = 1;
            }
        }

        return (
            <Menu
                onClick={this.clickTreeRightClickMenu.bind(this)}
                style={{ width: 200 }}
            >
                {showMenuItem[0] === 1 ? (
                    <Menu.Item key="0">
                        <FolderAddTwoTone /> {intl.get("Tree.Menu.CREATE_CONN")}
                    </Menu.Item>
                ) : (
                    ""
                )}
                {showMenuItem[1] === 1 ? (
                    <Menu.Item key="1">
                        <EditTwoTone /> {intl.get("Tree.Menu.UPDATE_CONN")}
                    </Menu.Item>
                ) : (
                    ""
                )}
                {showMenuItem[2] === 1 ? (
                    <Menu.Item key="2">
                        <DeleteTwoTone /> {intl.get("Tree.Menu.DEL_CONN")}
                    </Menu.Item>
                ) : (
                    ""
                )}
                {showMenuItem[3] === 1 ? (
                    <Menu.Item key="3">
                        <FolderAddTwoTone />{" "}
                        {intl.get("Tree.Menu.CREATE_FOLDER")}
                    </Menu.Item>
                ) : (
                    ""
                )}
                {showMenuItem[4] === 1 ? (
                    <Menu.Item key="4">
                        <EditTwoTone /> {intl.get("Tree.Menu.UPDATE_FOLDER")}
                    </Menu.Item>
                ) : (
                    ""
                )}
                {showMenuItem[5] === 1 ? (
                    <Menu.Item key="5">
                        <DeleteTwoTone /> {intl.get("Tree.Menu.DEL_FOLDER")}
                    </Menu.Item>
                ) : (
                    ""
                )}
                {showMenuItem[6] === 1 ? (
                    <Menu.Item key="6">
                        <DeleteTwoTone /> {intl.get("Tree.Menu.DEL_ALL")}
                    </Menu.Item>
                ) : (
                    ""
                )}
                {showMenuItem[7] === 1 ? (
                    <Menu.Item key="7">
                        <CodeTwoTone />{" "}
                        {intl.get("Tree.Menu.CREATE_CONN_TERMINAL")}
                    </Menu.Item>
                ) : (
                    ""
                )}
                {showMenuItem[8] === 1 ? (
                    <Menu.Item key="8">
                        <PlusSquareTwoTone />{" "}
                        {intl.get("Tree.Menu.CREATE_CONN_MUTI")}
                    </Menu.Item>
                ) : (
                    ""
                )}
                {showMenuItem[9] === 1 ? (
                    <Menu.Item key="9">
                        <ApiTwoTone /> {intl.get("Tree.Menu.DISCONNECT_CONN")}
                    </Menu.Item>
                ) : (
                    ""
                )}
                {showMenuItem[10] === 1 ? (
                    <Menu.Item key="10">
                        <FolderAddTwoTone />{" "}
                        {intl.get("Tree.Menu.CREATE_FOLDER_ON_ROOT")}
                    </Menu.Item>
                ) : (
                    ""
                )}
                {showMenuItem[11] === 1 ? (
                    <Menu.Item key="11">
                        <CopyTwoTone /> {intl.get("Tree.Menu.COPY_CONN")}
                    </Menu.Item>
                ) : (
                    ""
                )}
            </Menu>
        );
    }
    /**
     *新建或者更新目录
     *
     * @param {*} values
     * @memberof ResourceTree
     */
    handleCreateOrUpdateFolderModalOk(values) {
        let folderName = values.folderName;
        let newNode = {
            title: folderName,
            name: folderName,
            isLeaf: false,
        };
        if (this.state.createOrUpdateFolderModal.type === 0) {
            // 新建
            let keys = resourceTreeSelectKeys;
            newNode.key = uuid.v4();
            newNode.children = [];
            let key = undefined;
            if (
                this.state.createOrUpdateFolderModal.createOnRoot === true ||
                typeof keys === "undefined" ||
                keys.length === 0
            ) {
                // 没有选中，就在根目录创建
                key = undefined;
            } else if (keys.length === 1) {
                // 选中，选中目录创建
                key = keys[0];
            }
            this.props.addHostsData(key, newNode);
        } else {
            // 修改
            let keys = resourceTreeSelectKeys;
            let node = this.findNodeByNodeKey(this.props.hosts, keys[0]);
            Object.assign(node, newNode);
            this.props.modifyHostsData(node);
        }
        this.handleCreateOrUpdateFolderModalCancel();
    }
    /**
     *关闭新建或者更新连接窗口
     *
     * @memberof ResourceTree
     */
    handleCreateOrUpdateFolderModalCancel() {
        this.setState({
            createOrUpdateFolderModal: {
                visible: false,
                type: 0,
                folderName: "",
            },
        });
    }
    /**
     *处理新建或者更新连接
     *
     * @param {*} values
     * @memberof ResourceTree
     */
    handleCreateOrUpdateHostModalOk(data) {
        let newNode = {
            title: data.name,
            name: data.name,
            isLeaf: true,
            data: {
                ...data,
                host: data.host,
                port: data.port,
                auth: data.auth,
                connectType: data.connectType,
                masterName: data.masterName,
                sentinelPassword: data.sentinelPassword,
            },
        };

        if (this.state.createOrUpdateHostModal.type === 0) {
            let keys = resourceTreeSelectKeys;
            let key = undefined;
            if (typeof keys === "undefined" || keys.length === 0) {
                // 没有选中，就在根目录创建
                key = undefined;
            } else if (keys.length === 1) {
                // 选中，选中目录创建
                key = keys[0];
            }
            this.props.addHostsData(key, newNode);
        } else {
            let keys = resourceTreeSelectKeys;
            let node = this.findNodeByNodeKey(this.props.hosts, keys[0]);
            if (node.redis !== null && node.redis !== undefined) {
                node.redis.disconnect();
            }
            Object.assign(node, newNode);
            this.props.modifyHostsData(node);
        }
        this.handleCreateOrUpdateHostModalCancel();
    }
    /**
     *关闭新建或者更新连接窗口
     *
     * @memberof ResourceTree
     */
    handleCreateOrUpdateHostModalCancel() {
        let createOrUpdateHostModal = {
            createOrUpdateHostModal: {
                visible: false,
                type: 0,
                data: {
                    name: "",
                    host: "",
                    port: 6379,
                    auth: "",
                    connectType: "0",
                    masterName: "",
                    proxyuse: false,
                    proxyhost: "",
                    proxysshport: 22,
                    proxyusername: "root",
                    proxypassword: "root",
                    proxysshkeypath: "",
                },
            },
        };
        this.setState(createOrUpdateHostModal);
    }
    /**
     * 双击tree
     */
    handleDoubleClick() {
        this.connectAndOpenTabByType(OPEN_TAB_TYPE.CONN);
    }
    /**
     * 连接 & 打开tab
     */
    connectAndOpenTabByType(type) {
        let keys = resourceTreeSelectKeys;
        if (typeof keys !== "undefined" && keys.length === 1) {
            let node = this.findNodeByNodeKey(this.props.hosts, keys[0]);
            node.type = type;
            if (node.isLeaf) {
                let redis = node.redis;
                if (redis === undefined || redis == null) {
                    // 如果不存在，则直接连接redis
                    this.props.connectRedis(node, (ret) => {
                        if (ret != null && ret.code === 0) {
                            this.openTabByType(node);
                        }
                    });
                } else {
                    try {
                        // 如果存在，则使用ping探测连接是否正常
                        redis.ping((err, res) => {
                            if (err) {
                                // 连接失败，则重连
                                this.props.connectRedis(node, (ret) => {
                                    if (ret != null && ret.code === 0) {
                                        this.openTabByType(node);
                                    }
                                });
                                return;
                            }
                            // success
                            this.openTabByType(node);
                        });
                    } catch (e) {
                        Log.error("ResourceTree redis.ping error", e);
                    }
                }
            }
        }
    }
    /**
     *打开tab
     *
     * @param {*} node
     * @memberof ResourceTree
     */
    openTabByType(node) {
        let newNode = node;
        if (node.type === OPEN_TAB_TYPE.CONN) {
            newNode = Object.assign({}, node);
        } else if (
            node.type === OPEN_TAB_TYPE.CONN_TERMINAL ||
            node.type === OPEN_TAB_TYPE.CONN_MUTI ||
            node.type === OPEN_TAB_TYPE.URL
        ) {
            newNode = Object.assign({}, node);
            newNode.key = uuid.v4();
        }
        this.props.addHostTab(newNode);
        this.props.activeHostTab(newNode.key);
    }

    /**
     *选择树节点
     *
     * @memberof ResourceTree
     */
    onDirectoryTreeSelect = (keys, event) => {
        resourceTreeSelectKeys = keys;
    };
    render() {
        return (
            <div>
                <Dropdown
                    overlay={this.showTreeRightClickMenu.bind(this)}
                    trigger={["contextMenu"]}
                >
                    <div style={{ height: "100vh" }}>
                        <DirectoryTree
                            multiple
                            style={{
                                margin: "20px",
                            }}
                            onSelect={this.onDirectoryTreeSelect.bind(this)}
                            treeData={this.props.hosts}
                            onDoubleClick={this.handleDoubleClick.bind(this)}
                            draggable
                            onDrop={(info) => {
                                let sourceNode = info.dragNode;
                                let targetNode = info.node;
                                if (targetNode.isLeaf === false) {
                                    this.props.modifyHostPosition(
                                        sourceNode.key,
                                        targetNode.key
                                    );
                                }
                            }}
                        ></DirectoryTree>
                    </div>
                </Dropdown>
                <CreateOrUpdateFolderModal
                    visible={this.state.createOrUpdateFolderModal.visible}
                    type={this.state.createOrUpdateFolderModal.type}
                    folderName={this.state.createOrUpdateFolderModal.folderName}
                    handleCreateOrUpdateFolderModalOk={this.handleCreateOrUpdateFolderModalOk.bind(
                        this
                    )}
                    handleCreateOrUpdateFolderModalCancel={this.handleCreateOrUpdateFolderModalCancel.bind(
                        this
                    )}
                />
                <CreateOrUpdateHostModal
                    visible={this.state.createOrUpdateHostModal.visible}
                    type={this.state.createOrUpdateHostModal.type}
                    data={this.state.createOrUpdateHostModal.data}
                    handleCreateOrUpdateHostModalOk={this.handleCreateOrUpdateHostModalOk.bind(
                        this
                    )}
                    handleCreateOrUpdateHostModalCancel={this.handleCreateOrUpdateHostModalCancel.bind(
                        this
                    )}
                />
            </div>
        );
    }
}
/**
 *连接redis
 *
 * @param {*} node
 * @returns
 */
function connectRedis(node, callback) {
    return (dispatch) => {
        RedisService.connectRedis(node, dispatch, callback);
    };
}

const mapStateToProps = (state) => {
    return {
        hosts: state.hostDataReducer.hosts,
        hostTabsReducer: state.hostTabsReducer,
    };
};
const mapDispatchToProps = {
    getHostsData,
    delHostsData,
    addHostsData,
    modifyHostsData,
    modifyHostPosition,
    addHostTab,
    activeHostTab,
    connectRedis,
};
export default connect(mapStateToProps, mapDispatchToProps)(ResourceTree);
