import React, { Component } from "react";
import {
    Space,
    Input,
    Button,
    Modal,
    Select,
    Form,
    Tooltip,
    Tree,
    Tag,
} from "antd";
import { message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { REDIS_DATA_TYPE } from "@/utils/constant";
import "@/pages/CommonCss/zebra.css";
import uuid from "node-uuid";
import Log from "@/services/LogService";
import intl from "react-intl-universal";
const { Search } = Input;
const { Option } = Select;
const { DirectoryTree } = Tree;
/**
 *host 管理
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
        treeDataTotal: 0,
        searchDisable: false,
        createKeyMadal: { visible: false, keyType: REDIS_DATA_TYPE.STRING },
    };
    searchInput = React.createRef();
    componentDidMount() {
        this.setState({
            treeData: [],
            treeDataTotal: 0,
            searchDisable: true,
        });
        this.props.node.redis.select(this.props.db, (err, res) => {
            if (err) {
                message.error("" + err);
                Log.error("HostKeyTree componentDidMount error", err, res);
                return;
            }
            this.loadRedisDataByPattern("*");
        });
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
        }
    }
    /**
     * treeMap to treeData
     * @param {*} treeMap
     * @param {*} treeData
     */
    treeMapToTreeData(treeMap, treeData) {
        for (let item of treeMap.entries()) {
            let key = item[0];
            let value = item[1];
            if (value.size > 0) {
                let children = [];
                treeData.push({
                    title: key,
                    key: uuid.v4(),
                    children,
                });
                this.treeMapToTreeData(value, children);
            } else {
                treeData.push({
                    title: key,
                    key: uuid.v4(),
                    isLeaf: true,
                });
            }
        }
    }
    /**
     * 加载 redis key
     * @param {*} pattern
     */
    loadRedisDataByPattern(pattern) {
        if (pattern !== "*") {
            pattern = "*" + pattern + "*";
        }
        let redis = this.props.node.redis;
        redis.keys(pattern).then(
            (res) => {
                this.setState({
                    treeData: [],
                    treeDataTotal: 0,
                    searchDisable: true,
                });
                let treeData = [];
                if (res !== null && res !== undefined && res.length !== 0) {
                    let rootTreeMap = new Map();
                    for (let i = 0; i < res.length; i++) {
                        let key = res[i];
                        let childKeyArr = key.split(":");
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
                        }
                    }
                    this.treeMapToTreeData(rootTreeMap, treeData);
                    console.info("treeData", treeData);
                }
                this.setState({
                    treeData: treeData,
                    treeDataTotal: treeData.length,
                    searchDisable: false,
                });
            },
            (err) => {
                message.error("" + err);
                Log.error("HostKeyTree refreshValue error", err);
            }
        );
    }
    /**
     *搜索key
     *
     * @param {*} value
     * @memberof HostKeyTree
     */
    searchKey(value) {
        if (value === null || value === undefined || value === "") {
            value = "*";
        }
        let pattern = value;
        let cursor = "0";
        let maxRecords = 10000;
        pattern = "*" + pattern + "*";
        this.loadRedisDataByPattern(pattern, cursor, maxRecords, value);
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
        redis.get(key).then(
            (value0) => {
                if (value0 !== null) {
                    message.error(
                        intl.get("HostKey.key.exist") + ", key > " + key
                    );
                } else {
                    let keyType = form.getFieldValue("keyType");
                    if (keyType === REDIS_DATA_TYPE.STRING) {
                        redis.set(key, "").then(
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
                        redis.zadd(key, 1, "default-member").then(
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
                        redis.sadd(key, "default-member").then(
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
                        redis.hset(key, "default-member", "default-value").then(
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
                        redis.lpush(key, "default-member").then(
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
                }
            },
            (err) => {
                message.error("" + err);
                Log.error("HostKeyTree createKey error", err);
            }
        );
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
    render() {
        return (
            <div>
                <Space size="small" direction="vertical">
                    <Button block onClick={this.openCreateKeyMadal.bind(this)}>
                        {intl.get("HostKey.create.key")}
                    </Button>
                    <Tooltip
                        placement="right"
                        title={intl.get("common.search.tooltip.limit")}
                    >
                        <Search
                            ref={this.searchInput}
                            onSearch={this.searchKey.bind(this)}
                            enterButton={
                                <Button icon={<SearchOutlined />}></Button>
                            }
                            disabled={this.state.searchDisable}
                        />
                    </Tooltip>
                    <Tag>keys total: {this.state.treeDataTotal}</Tag>
                    <DirectoryTree
                        multiple
                        treeData={this.state.treeData}
                        height={600}
                    ></DirectoryTree>
                </Space>
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
