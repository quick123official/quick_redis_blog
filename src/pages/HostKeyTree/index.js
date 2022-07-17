import React, { Component } from "react";
import {
    Input,
    Button,
    Modal,
    Select,
    Form,
    Tooltip,
    Tree,
    Dropdown,
    Menu,
    Row,
    Col,
    AutoComplete,
} from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
    REDIS_DATA_TYPE,
    CONNECT_TYPE,
    REDIS_DATA_SHOW,
} from "@/utils/constant";
import "@/pages/CommonCss/zebra.css";
import uuid from "node-uuid";
import Log from "@/services/LogService";
import KeysHistoryService from "@/services/KeysHistoryService";
import LocaleUtils from "@/utils/LocaleUtils";
import BufferUtils from "@/utils/BufferUtils";
import { notification } from "antd";
import intl from "react-intl-universal";
var lodash = window.require("lodash");
const { Search } = Input;
const { Option } = Select;
const { DirectoryTree } = Tree;
/**
 * tree 显示 keys
 *
 * @class HostKeyTree
 * @extends {Component}
 */
class HostKeyTree extends Component {
    /**
     * table layout
     *
     * @memberof HostKeySortSet
     */
    layout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
    };
    /**
     *标记key分割的结束符号
     *
     * @memberof HostKeyTree
     */
    splitEndSign = "]@[+p";
    /**
     *分隔符
     *
     * @memberof HostKeyTree
     */
    splitSign = "";
    /**
     * 选中的key
     *
     * @memberof HostKeyTree
     */
    resourceTreeSelectKey = { selectedKey: "", isLeaf: true };
    /**
     *
     *
     * @memberof HostKeyTree
     */
    initValues = { key: "", keyType: REDIS_DATA_TYPE.STRING };
    /**
     *
     *
     * @memberof HostKeyTree
     */
    state = {
        treeData: [],
        searchDisable: false,
        createKeyMadal: { visible: false, keyType: REDIS_DATA_TYPE.STRING },
        autoCompleteOptions: [],
    };
    searchInput = React.createRef();
    componentDidMount() {
        // 获取配置的key分割符
        this.splitSign = LocaleUtils.readSystemConfig().splitSign;
        this.searchKey("*");
        this.props.triggerRef(this);
    }
    /**
     * 删除key重新搜索
     */
    deleteKeyAndSearch = () => {
        this.searchKey(this.searchInput.current.input.value);
    };
    /**
     * 构建 treeMap
     * @param {*} parentMap
     * @param {*} parentKeyArr
     */
    keyArrToTreeMap(parentMap, parentKeyArr) {
        let childMap = parentMap.get(parentKeyArr[0]);
        if (childMap === null || childMap === undefined) {
            childMap = new Map();
            parentMap.set(parentKeyArr[0], childMap);
        }
        if (parentKeyArr.length > 1) {
            this.keyArrToTreeMap(
                childMap,
                parentKeyArr.slice(1, parentKeyArr.length)
            );
        } else {
            parentMap.set(parentKeyArr[0] + this.splitEndSign, undefined);
        }
    }
    /**
     * treeMap to treeData
     * @param {*} treeMap
     * @param {*} treeData
     */
    treeMapToTreeData(treeMap, treeData, parentKey) {
        var repeatKeyCheck = new Set();
        for (let item of treeMap.entries()) {
            let key = item[0];
            let value = item[1];
            if (value !== undefined && value.size > 0) {
                let children = [];
                treeData.push({
                    title: key,
                    key: uuid.v4(),
                    currentKey: parentKey + this.splitSign + key,
                    children,
                });
                this.treeMapToTreeData(
                    value,
                    children,
                    parentKey + this.splitSign + key
                );
            } else {
                let orgiKey = key;
                if (key.endsWith(this.splitEndSign)) {
                    orgiKey = key.substr(
                        0,
                        key.length - this.splitEndSign.length
                    );
                }
                if (!repeatKeyCheck.has(orgiKey)) {
                    repeatKeyCheck.add(orgiKey);
                    treeData.push({
                        title: orgiKey,
                        key: uuid.v4(),
                        currentKey: parentKey + this.splitSign + orgiKey,
                        isLeaf: true,
                    });
                }
            }
        }
    }
    /**
     *加载 redis key
     *
     * @param {*} pattern
     * @param {*} cursor
     * @param {*} originalKey
     * @memberof HostKeyTree
     */
    loadRedisDataByPattern(tableData, pattern, cursor, originalKey) {
        let redisArr = [this.props.node.redis];
        if (this.props.node.data.connectType === CONNECT_TYPE.CLUSTER) {
            redisArr = this.props.node.redis.nodes("master");
        }
        let patternBuffer = BufferUtils.hexToBuffer(pattern);
        redisArr[0].scanBuffer(
            cursor,
            "MATCH",
            patternBuffer,
            "COUNT",
            REDIS_DATA_SHOW.FETCH_DATA_SIZE,
            (err, res) => {
                if (err) {
                    this.setState({ searchDisable: false });
                    message.error("" + err);
                    Log.error(
                        "[cmd=HostKeyTree] loadRedisDataByPattern error",
                        pattern,
                        cursor,
                        originalKey,
                        err
                    );
                    return;
                }
                let data = [];
                for (let i = 0; i < res[1].length; i++) {
                    let strRes = BufferUtils.bufferToString(res[1][i]);
                    if (strRes === originalKey) {
                        continue;
                    }
                    data.push(strRes);
                }
                if (data.length !== 0) {
                    tableData = [...tableData, ...data];
                    // 如果key存在，则添加到搜索历史记录
                    let host = this.props.node.data.host;
                    let port = this.props.node.data.port;
                    KeysHistoryService.addKeysHistory(host, port, originalKey);
                }
                let strCursor = BufferUtils.bufferToString(res[0]);
                if (
                    tableData.length <
                        REDIS_DATA_SHOW.MAX_SEARCH_DATA_SIZE_TREE &&
                    strCursor !== "0"
                ) {
                    this.loadRedisDataByPattern(
                        tableData,
                        pattern,
                        strCursor,
                        originalKey
                    );
                } else {
                    if (
                        tableData.length >=
                        REDIS_DATA_SHOW.MAX_SEARCH_DATA_SIZE_TREE
                    ) {
                        message.info(
                            "符合条件的数据条数太大。只显示：" +
                                REDIS_DATA_SHOW.MAX_SEARCH_DATA_SIZE_TREE
                        );
                    }
                    let treeData = [];
                    if (
                        tableData !== null &&
                        tableData !== undefined &&
                        tableData.length !== 0
                    ) {
                        // 先对key进行排序
                        tableData = lodash.orderBy(tableData);
                        let rootTreeMap = new Map();
                        for (let i = 0; i < tableData.length; i++) {
                            let keyTemp = tableData[i];
                            let childKeyArr = keyTemp.split(this.splitSign);
                            let childMap = rootTreeMap.get(childKeyArr[0]);
                            if (childMap === null || childMap === undefined) {
                                childMap = new Map();
                            }
                            rootTreeMap.set(childKeyArr[0], childMap);
                            if (childKeyArr.length > 1) {
                                this.keyArrToTreeMap(
                                    childMap,
                                    childKeyArr.slice(1, childKeyArr.length)
                                );
                            } else {
                                rootTreeMap.set(
                                    childKeyArr[0] + this.splitEndSign,
                                    undefined
                                );
                            }
                        }
                        // 如果key存在，则添加到搜索历史记录
                        let host = this.props.node.data.host;
                        let port = this.props.node.data.port;
                        KeysHistoryService.addKeysHistory(
                            host,
                            port,
                            originalKey
                        );
                        this.treeMapToTreeData(rootTreeMap, treeData, "");
                    }
                    this.setState({
                        treeData: treeData,
                        searchDisable: false,
                    });
                }
            }
        );
    }
    /**
     * 加载 redis key
     * @param {*} pattern
     */
    loadRedisKeysByPattern(key) {
        let pattern = "*";
        if (key !== null && key !== undefined && key !== "") {
            pattern = "*" + key + "*";
        }
        let redisArr = [this.props.node.redis];
        if (this.props.node.data.connectType === CONNECT_TYPE.CLUSTER) {
            redisArr = this.props.node.redis.nodes("master");
        }
        let keyBuffer = BufferUtils.hexToBuffer(pattern);
        redisArr[0].keysBuffer(keyBuffer).then(
            (res) => {
                this.setState({
                    treeData: [],
                    searchDisable: true,
                });
                let treeData = [];
                if (res !== null && res !== undefined && res.length !== 0) {
                    // 先对key进行排序
                    res = lodash.orderBy(res);
                    let rootTreeMap = new Map();
                    for (let i = 0; i < res.length; i++) {
                        let keyTemp = BufferUtils.bufferToString(res[i]);
                        let childKeyArr = keyTemp.split(this.splitSign);
                        let childMap = rootTreeMap.get(childKeyArr[0]);
                        if (childMap === null || childMap === undefined) {
                            childMap = new Map();
                        }
                        rootTreeMap.set(childKeyArr[0], childMap);
                        if (childKeyArr.length > 1) {
                            this.keyArrToTreeMap(
                                childMap,
                                childKeyArr.slice(1, childKeyArr.length)
                            );
                        } else {
                            rootTreeMap.set(
                                childKeyArr[0] + this.splitEndSign,
                                undefined
                            );
                        }
                    }
                    // 如果key存在，则添加到搜索历史记录
                    let host = this.props.node.data.host;
                    let port = this.props.node.data.port;
                    KeysHistoryService.addKeysHistory(host, port, key);
                    this.treeMapToTreeData(rootTreeMap, treeData, "");
                }
                this.setState({
                    treeData: treeData,
                    searchDisable: false,
                });
            },
            (err) => {
                message.error("loadRedisKeysByPattern error" + err);
                Log.error("HostKeyTree loadRedisKeysByPattern error", err);
            }
        );
    }
    /**
     *搜索key
     *
     * @param {*} key
     * @memberof HostKeyTree
     */
    searchKey(key) {
        if (key === null || key === undefined || key === "") {
            key = "*";
        }
        this.setState({
            treeData: [],
            searchDisable: true,
        });
        let tableData = [];
        let pattern = "*" + key + "*";
        let cursor = "0";
        this.loadRedisDataByPattern(tableData, pattern, cursor, key);
    }
    /**
     * 打开 创建key 窗口
     */
    openCreateKeyMadal() {
        this.setState({ createKeyMadalVisible: true });
    }
    /**
     *关闭 创建key 窗口
     *
     * @memberof HostKeyTree
     */
    cancelCreateKeyMadal = (e) => {
        this.setState({
            createKeyMadalVisible: false,
        });
    };
    /**
     *确定 创建key 窗口
     *
     * @memberof HostKeyTree
     */
    okCreateKeyMadal = (e) => {
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        let redis = this.props.node.redis;
        let key = form.getFieldValue("key");
        let keyType = form.getFieldValue("keyType");
        let keyBuffer = BufferUtils.hexToBuffer(key);
        redis.typeBuffer(keyBuffer, (err, retKeyType) => {
            if (err) {
                message.error("" + err);
                Log.error("HostKeyTree create key error", key, err);
                return;
            }
            let strRetKeyType = BufferUtils.bufferToString(retKeyType);
            if (strRetKeyType !== "none") {
                message.error(intl.get("HostKey.key.exist") + ", key > " + key);
                return;
            }
            if (keyType === REDIS_DATA_TYPE.STRING) {
                redis.setBuffer(keyBuffer, "").then(
                    (value) => {
                        this.okCreateKeyMadalSuccess(key, keyType);
                    },
                    (err) => {
                        message.error("" + err);
                        Log.error(
                            "HostKeyTree okCreateKeyMadal string error",
                            err
                        );
                    }
                );
            } else if (keyType === REDIS_DATA_TYPE.ZSET) {
                redis.zaddBuffer(keyBuffer, 1, "default-member").then(
                    (value) => {
                        this.okCreateKeyMadalSuccess(key, keyType);
                    },
                    (err) => {
                        message.error("" + err);
                        Log.error(
                            "HostKeyTree okCreateKeyMadal zset error",
                            err
                        );
                    }
                );
            } else if (keyType === REDIS_DATA_TYPE.SET) {
                redis.saddBuffer(keyBuffer, "default-member").then(
                    (value) => {
                        this.okCreateKeyMadalSuccess(key, keyType);
                    },
                    (err) => {
                        message.error("" + err);
                        Log.error(
                            "HostKeyTree okCreateKeyMadal set error",
                            err
                        );
                    }
                );
            } else if (keyType === REDIS_DATA_TYPE.HASH) {
                redis
                    .hsetBuffer(keyBuffer, "default-member", "default-value")
                    .then(
                        (value) => {
                            this.okCreateKeyMadalSuccess(key, keyType);
                        },
                        (err) => {
                            message.error("" + err);
                            Log.error(
                                "HostKeyTree okCreateKeyMadal hash error",
                                err
                            );
                        }
                    );
            } else if (keyType === REDIS_DATA_TYPE.LIST) {
                redis.lpushBuffer(keyBuffer, "default-member").then(
                    (value) => {
                        this.okCreateKeyMadalSuccess(key, keyType);
                    },
                    (err) => {
                        message.error("" + err);
                        Log.error(
                            "HostKeyTree okCreateKeyMadal list error",
                            err
                        );
                    }
                );
            }
        });
        this.searchKey(this.searchInput.current.input.value);
    };
    /**
     *创建KEY成功，关闭窗口，调用父组件创建key
     *
     * @param {*} key
     * @param {*} keyType
     * @memberof HostKeyTree
     */
    okCreateKeyMadalSuccess(key, keyType) {
        this.setState({
            createKeyMadalVisible: false,
        });
        this.props.createKey(key, keyType);
        this.initValues = { key: "", keyType: keyType };
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        form.resetFields();
    }
    /**
     *显示右键菜单
     *
     * @memberof HostKeyTree
     */
    showTreeRightClickMenu() {
        let showMenuItem = [1];
        return (
            <Menu
                onClick={this.clickTreeRightClickMenu.bind(this)}
                style={{ width: 200 }}
            >
                {showMenuItem[0] === 1 ? (
                    <Menu.Item key="0">
                        <DeleteTwoTone />{" "}
                        {intl.get("HostKeyTree.delete.key.node")}
                    </Menu.Item>
                ) : (
                    ""
                )}
            </Menu>
        );
    }
    /**
     *点击菜单项目
     *
     * @param {*} item
     * @memberof HostKeyTree
     */
    clickTreeRightClickMenu(item) {
        let selectedKey = this.resourceTreeSelectKey.selectedKey;
        let isLeaf = this.resourceTreeSelectKey.isLeaf;
        let orgiKey = selectedKey.substr(
            this.splitSign.length,
            selectedKey.length
        );
        let pattern = orgiKey;
        if (!isLeaf) {
            pattern = pattern + this.splitSign + "*";
        }
        let redis = this.props.node.redis;
        redis.keysBuffer(pattern).then(
            (res) => {
                if (res !== null && res !== undefined && res.length !== 0) {
                    for (let i = 0; i < res.length; i++) {
                        let key = res[i];
                        redis.del(key).then(
                            (value) => {},
                            (err) => {
                                message.error(
                                    "del key error. key: " + key + ". " + err
                                );
                                Log.error(
                                    "clickTreeRightClickMenu del key error. key: " +
                                        key +
                                        ". ",
                                    err
                                );
                            }
                        );
                    }
                    this.searchKey(this.searchInput.current.input.value);
                }
            },
            (err) => {
                message.error("clickTreeRightClickMenu keys error" + err);
                Log.error("clickTreeRightClickMenu keys error", err);
            }
        );
    }
    /**
     *选择树节点
     *
     * @memberof ResourceTree
     */
    onDirectoryTreeSelect = (keys, event) => {
        this.resourceTreeSelectKey.selectedKey = event.node.currentKey;
        this.resourceTreeSelectKey.isLeaf = event.node.isLeaf;
        if (this.resourceTreeSelectKey.isLeaf) {
            let currentKey = this.resourceTreeSelectKey.selectedKey;
            let orgiKey = currentKey.substr(
                this.splitSign.length,
                currentKey.length
            );
            this.props.updateHostKey(orgiKey + "");
        }
    };
    /**
     * 双击tree
     */
    handleDoubleClick(event, node) {
        if (node.isLeaf) {
            let currentKey = node.currentKey;
            let orgiKey = currentKey.substr(
                this.splitSign.length,
                currentKey.length
            );
            this.props.updateHostKey(orgiKey);
        }
    }

    onAutoCompleteSelect = (data) => {
        this.setState({ autoCompleteOptions: [] });
    };

    onAutoCompleteChange = (data) => {
        // 如果key存在，则添加到搜索历史记录
        let host = this.props.node.data.host;
        let port = this.props.node.data.port;
        let keyHistoryArr = KeysHistoryService.searchKey(host, port, data);
        this.setState({ autoCompleteOptions: keyHistoryArr });
    };

    render() {
        return (
            <div>
                <Row gutter={[16, 6]}>
                    <Col span={24}>
                        <Button
                            block
                            onClick={this.openCreateKeyMadal.bind(this)}
                        >
                            {intl.get("HostKey.create.key")}
                        </Button>
                    </Col>
                    <Col span={24}>
                        <Tooltip
                            placement="right"
                            title={intl.get("common.search.tooltip.limit")}
                        >
                            <AutoComplete
                                options={this.state.autoCompleteOptions}
                                onSelect={this.onAutoCompleteSelect.bind(this)}
                                onChange={this.onAutoCompleteChange.bind(this)}
                                style={{ width: "100%" }}
                            >
                                <Search
                                    ref={this.searchInput}
                                    onSearch={this.searchKey.bind(this)}
                                    enterButton={
                                        <Button
                                            icon={<SearchOutlined />}
                                        ></Button>
                                    }
                                    disabled={this.state.searchDisable}
                                />
                            </AutoComplete>
                        </Tooltip>
                    </Col>
                    <Col span={24}>
                        <Dropdown
                            overlay={this.showTreeRightClickMenu.bind(this)}
                            trigger={["contextMenu"]}
                        >
                            <div>
                                <DirectoryTree
                                    treeData={this.state.treeData}
                                    onSelect={this.onDirectoryTreeSelect.bind(
                                        this
                                    )}
                                    onDoubleClick={this.handleDoubleClick.bind(
                                        this
                                    )}
                                    height={750}
                                ></DirectoryTree>
                            </div>
                        </Dropdown>
                    </Col>
                </Row>
                <div>
                    <Modal
                        title={intl.get("HostKey.create.key")}
                        okText={intl.get("common.ok")}
                        cancelText={intl.get("common.cancel")}
                        visible={this.state.createKeyMadalVisible}
                        onOk={() => {
                            let form = this.refs.form;
                            if (form === undefined) {
                                return;
                            }
                            form.submit();
                        }}
                        onCancel={this.cancelCreateKeyMadal}
                    >
                        <Form
                            initialValues={{ ...this.initValues }}
                            {...this.layout}
                            ref="form"
                            onFinish={this.okCreateKeyMadal.bind(this)}
                        >
                            <Form.Item
                                name="key"
                                label="key"
                                rules={[
                                    {
                                        required: true,
                                        message: intl.get(
                                            "common.error.input.value"
                                        ),
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="keyType"
                                label={intl.get("HostKey.modal.keyType")}
                                rules={[
                                    {
                                        required: true,
                                        message: intl.get(
                                            "common.error.input.value"
                                        ),
                                    },
                                ]}
                            >
                                <Select>
                                    <Option value={REDIS_DATA_TYPE.STRING}>
                                        {REDIS_DATA_TYPE.STRING}
                                    </Option>
                                    <Option value={REDIS_DATA_TYPE.ZSET}>
                                        {REDIS_DATA_TYPE.ZSET}
                                    </Option>
                                    <Option value={REDIS_DATA_TYPE.SET}>
                                        {REDIS_DATA_TYPE.SET}
                                    </Option>
                                    <Option value={REDIS_DATA_TYPE.HASH}>
                                        {REDIS_DATA_TYPE.HASH}
                                    </Option>
                                    <Option value={REDIS_DATA_TYPE.LIST}>
                                        {REDIS_DATA_TYPE.LIST}
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default HostKeyTree;
