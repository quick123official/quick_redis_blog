import React, { Component } from "react";
import {
    Space,
    Table,
    Input,
    Button,
    Modal,
    Select,
    Form,
    Tooltip,
    AutoComplete,
} from "antd";
import { message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
    REDIS_DATA_TYPE,
    REDIS_DATA_SHOW,
    CONNECT_TYPE,
} from "@/utils/constant";
import KeysHistoryService from "@/services/KeysHistoryService";
import Log from "@/services/LogService";
import "@/pages/CommonCss/zebra.css";
import BufferUtils from "@/utils/BufferUtils";
import intl from "react-intl-universal";
var lodash = window.require("lodash");
const { Search } = Input;
const { Option } = Select;
/**
 * 表格显示 keys
 *
 * @class HostKey
 * @extends {Component}
 */
class HostKey extends Component {
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
     * @memberof HostKey
     */
    initValues = { key: "", keyType: REDIS_DATA_TYPE.STRING };
    /**
     *
     *
     * @memberof HostKey
     */
    state = {
        tableData: [],
        tableTotal: 10,
        currentPage: 1,
        pageSize: 15,
        searchDisable: false,
        selectedRowKey: "",
        createKeyMadal: { visible: false, keyType: REDIS_DATA_TYPE.STRING },
        autoCompleteOptions: [],
    };
    searchInput = React.createRef();
    componentDidMount() {
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
     *加载 redis key
     *
     * @param {*} pattern
     * @param {*} cursor
     * @param {*} originalKey
     * @memberof HostKey
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
                        "[cmd=HostKey] loadRedisDataByPattern error",
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
                    data.push({
                        key: strRes,
                        name: strRes,
                    });
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
                    tableData.length < REDIS_DATA_SHOW.MAX_SEARCH_DATA_SIZE &&
                    strCursor !== "0"
                ) {
                    this.loadRedisDataByPattern(
                        tableData,
                        pattern,
                        strCursor,
                        originalKey
                    );
                } else {
                    let firstTableDataNode = [];
                    let tableDataTmp = tableData;
                    if (tableData[0] !== undefined && tableData[0].isHit) {
                        firstTableDataNode.push(tableData[0]);
                        tableDataTmp = tableData.slice(1, tableData.length);
                    }
                    tableDataTmp = lodash.orderBy(
                        tableDataTmp,
                        ["key"],
                        ["asc"]
                    );
                    tableData = [...firstTableDataNode, ...tableDataTmp];
                    this.setState({
                        tableData: tableData,
                        tableTotal: tableData.length,
                        searchDisable: false,
                    });
                }
            }
        );
    }
    /**
     *搜索key
     *
     * @param {*} key
     * @memberof HostKey
     */
    searchKey(key) {
        if (key === null || key === undefined || key === "") {
            key = "*";
        }
        this.setState({
            tableData: [],
            searchDisable: true,
            currentPage: 1,
            tableTotal: 0,
        });
        let redisArr = [this.props.node.redis];
        if (this.props.node.data.connectType === CONNECT_TYPE.CLUSTER) {
            redisArr = this.props.node.redis.nodes("master");
        }
        let keyBuffer = BufferUtils.hexToBuffer(key);
        redisArr[0].typeBuffer(keyBuffer, (err, keyType) => {
            if (err) {
                this.setState({ searchDisable: false });
                message.error("" + err);
                Log.error("[cmd=HostKey] type error", key, err);
                return;
            }
            let strKeyType = BufferUtils.bufferToString(keyType);
            let tableData = [];
            if (strKeyType !== "none") {
                // 关键字的key，如果存在，显示在第一页第一行
                tableData.push({
                    key: key,
                    name: key,
                    isHit: true,
                });
            }
            let pattern = "*" + key + "*";
            let cursor = "0";
            this.loadRedisDataByPattern(tableData, pattern, cursor, key);
        });
    }
    /**
     *改变页码
     *
     * @param {*} page
     * @param {*} pageSize
     * @memberof HostKey
     */
    onPaginationChange(page, pageSize) {
        this.setState({ currentPage: page });
    }
    /**
     *页面显示条数改变
     *
     * @param {*} current
     * @param {*} size
     * @memberof HostKey
     */
    onShowSizeChange(current, size) {
        this.setState({ pageSize: size });
    }
    /**
     *斑马纹
     *
     * @param {*} record
     * @param {*} index
     * @returns
     * @memberof HostKey
     */
    renderRowClassName(record, index) {
        let className = "hostKeyCursor";
        if (record.key === this.state.selectedRowKey) {
            className += " hostKeySelected";
        } else {
            if (index % 2 === 1) {
                className += " hostKeyZebraHighlight";
            }
        }
        return className;
    }
    /**
     *行事件
     *
     * @param {*} record
     * @returns
     * @memberof HostKey
     */
    onRowEvent(record) {
        return {
            onClick: () => {
                this.setState({
                    selectedRowKey: record.key,
                });
                this.props.updateHostKey(record.key);
            },
        };
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
     * @memberof HostKey
     */
    cancelCreateKeyMadal = (e) => {
        this.setState({
            createKeyMadalVisible: false,
        });
    };
    /**
     *确定 创建key 窗口
     *
     * @memberof HostKey
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
                Log.error("[cmd=HostKey] createKey error", key, err);
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
                            "[cmd=HostKey] okCreateKeyMadal string error",
                            key,
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
                            "[cmd=HostKey] okCreateKeyMadal zset error",
                            key,
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
                            "[cmd=HostKey] okCreateKeyMadal set error",
                            key,
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
                                "[cmd=HostKey] okCreateKeyMadal hash error",
                                key,
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
                            "[cmd=HostKey] okCreateKeyMadal list error",
                            key,
                            err
                        );
                    }
                );
            }
        });
    };
    /**
     *创建KEY成功，关闭窗口，调用父组件创建key
     *
     * @param {*} key
     * @param {*} keyType
     * @memberof HostKey
     */
    okCreateKeyMadalSuccess(key, keyType) {
        let tableData = [{ key: key, name: key }, ...this.state.tableData];
        this.setState({
            tableData: tableData,
            tableTotal: tableData.length,
        });
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
                <Space size="small" direction="vertical">
                    <Button block onClick={this.openCreateKeyMadal.bind(this)}>
                        {intl.get("HostKey.create.key")}
                    </Button>
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
                                        disabled={this.state.searchDisable}
                                        icon={<SearchOutlined />}
                                    ></Button>
                                }
                            />
                        </AutoComplete>
                    </Tooltip>
                    <Table
                        // columns={columns}
                        columns={[
                            {
                                title: "",
                                dataIndex: "name",
                                key: "key",
                                ellipsis: "true",
                            },
                        ]}
                        dataSource={this.state.tableData}
                        bordered={true}
                        size={"small"}
                        pagination={{
                            position: "bottom",
                            pageSize: this.state.pageSize,
                            total: this.state.tableTotal,
                            responsive: true,
                            current: this.state.currentPage,
                            onChange: this.onPaginationChange.bind(this),
                            onShowSizeChange: this.onShowSizeChange.bind(this),
                        }}
                        rowClassName={this.renderRowClassName.bind(this)}
                        onRow={this.onRowEvent.bind(this)}
                    />
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

export default HostKey;
