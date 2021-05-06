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
} from "antd";
import { message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { REDIS_DATA_TYPE, REDIS_DATA_SHOW } from "@/utils/constant";
import "@/pages/CommonCss/zebra.css";
import Log from "@/services/LogService";
import intl from "react-intl-universal";
const { Search } = Input;
const { Option } = Select;
/**
 *host 管理
 *
 * @class HostKey
 * @extends {Component}
 */
// let columns = [
//     {
//         title: `keys 共${this.state.tableTotal || 0}条`,
//         dataIndex: "name",
//         key: "key",
//         ellipsis: "true",
//     },
// ];
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
    };
    searchInput = React.createRef();
    componentDidMount() {
        let pattern = "*";
        let cursor = "0";
        let maxRecords = 10000;
        this.setState({ tableData: [], searchDisable: true, currentPage: 1 });
        this.props.node.redis.select(this.props.db, (err, res) => {
            if (err) {
                message.error("" + err);
                Log.error("HostKey componentDidMount error", err, res);
                return;
            }
            this.loadRedisDataByPattern(pattern, cursor, maxRecords);
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
     *加载 redis key
     *
     * @param {*} pattern
     * @param {*} cursor
     * @param {*} maxRecords
     * @memberof HostKey
     */
    loadRedisDataByPattern(pattern, cursor, maxRecords, existKey) {
        let redis = this.props.node.redis;
        redis.scan(
            cursor,
            "MATCH",
            pattern,
            "COUNT",
            REDIS_DATA_SHOW.FETCH_DATA_SIZE,
            (err, res) => {
                if (err) {
                    this.setState({ searchDisable: false });
                    message.error("" + err);
                    Log.error("HostKey loadRedisDataByPattern error", err);
                    return;
                }
                let data = [];
                for (let i = 0; i < res[1].length; i++) {
                    if (res[1][i] === existKey) {
                        continue;
                    }
                    data.push({
                        key: res[1][i],
                        name: res[1][i],
                    });
                }
                if (data.length !== 0) {
                    let tableData = [...this.state.tableData, ...data];
                    this.setState({
                        tableData: tableData,
                        tableTotal: tableData.length,
                    });
                }
                if (
                    res[0] === "0" ||
                    this.state.tableData.length >= maxRecords
                ) {
                    this.setState({ searchDisable: false });
                    // 没有数据或获取的数据已经达到maxRecords，则不再获取
                    return;
                } else {
                    this.loadRedisDataByPattern(pattern, res[0], maxRecords);
                }
            }
        );
    }
    /**
     *搜索key
     *
     * @param {*} value
     * @memberof HostKey
     */
    searchKey(value) {
        if (value === null || value === undefined || value === "") {
            value = "*";
        }
        let redis = this.props.node.redis;
        redis.keys(value).then(
            (res) => {
                this.setState({
                    tableData: [],
                    searchDisable: true,
                    currentPage: 1,
                    tableTotal: 0,
                });
                let pattern = value;
                let cursor = "0";
                let maxRecords = 10000;
                pattern = "*" + pattern + "*";
                // 关键字的key，如果存在，必然显示在第一页第一行
                if (
                    res !== null &&
                    res !== undefined &&
                    res.length !== 0 &&
                    value !== "*"
                ) {
                    let data = [];
                    data.push({
                        key: value,
                        name: value,
                    });
                    if (data.length !== 0) {
                        let tableData = [...this.state.tableData, ...data];
                        this.setState({
                            tableData: tableData,
                            tableTotal: tableData.length,
                        });
                    }
                }
                this.loadRedisDataByPattern(pattern, cursor, maxRecords, value);
            },
            (err) => {
                message.error("" + err);
                Log.error("HostKey refreshValue error", err);
            }
        );
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
                                    "HostKey okCreateKeyMadal string error",
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
                                    "HostKey okCreateKeyMadal zset error",
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
                                    "HostKey okCreateKeyMadal set error",
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
                                    "HostKey okCreateKeyMadal hash error",
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
                                    "HostKey okCreateKeyMadal list error",
                                    err
                                );
                            }
                        );
                    }
                    let tableData = [
                        { key: key, name: key },
                        ...this.state.tableData,
                    ];
                    this.setState({
                        tableData: tableData,
                        tableTotal: tableData.length,
                    });
                }
            },
            (err) => {
                message.error("" + err);
                Log.error("HostKey createKey error", err);
            }
        );
    };
    /**
     *创建KEY成功，关闭窗口，调用父组件创建key
     *
     * @param {*} key
     * @param {*} keyType
     * @memberof HostKey
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
                    <Table
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
