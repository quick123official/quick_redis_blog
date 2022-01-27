import React, { Component } from "react";
import {
    Input,
    Button,
    Table,
    Popconfirm,
    Space,
    message,
    Tooltip,
    Modal,
    Form,
    Tag,
} from "antd";
import HostKeyHeader from "@/pages/HostKeyHeader";
import "@/pages/CommonCss/zebra.css";
import { REDIS_DATA_SHOW } from "@/utils/constant";
import uuid from "node-uuid";
import Log from "@/services/LogService";
import QuickMonacoEditor from "@/components/QuickMonacoEditor";
import intl from "react-intl-universal";
import LocaleUtils from "@/utils/LocaleUtils";
const { Search } = Input;
/**
 * HostKeyHash-管理
 *
 * @class HostKeyHash
 * @extends {Component}
 */

class HostKeyHash extends Component {
    /**
     * 只执行一次。第一次渲染后调用，只在客户端
     */
    componentDidMount() {
        let redisKey = this.props.redisKey;
        this.refreshValue(redisKey);
    }
    /**
     * 在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
     *
     * @param {*} nextProps
     * @memberof HostKeyHash
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        let redisKey = this.props.redisKey;
        this.refreshValue(redisKey);
    }
    /**
     * table columns
     *
     * @memberof HostKeyHash
     */
    columns = [
        {
            title: "id",
            dataIndex: "key",
            width: "10%",
            render: (text, record, index) => `${index + 1}`,
        },
        {
            title: "field",
            dataIndex: "field",
            width: "30%",
            ellipsis: "true",
        },
        {
            title: "value",
            dataIndex: "value",
            width: "40%",
            ellipsis: "true",
        },
        {
            title: intl.get("common.columns.title.op"),
            dataIndex: "key",
            render: (text, record) => (
                <div>
                    <Space size="small" direction="horizontal">
                        <Button
                            size="small"
                            onClick={() => {
                                this.openUpdateModal(record);
                            }}
                        >
                            {intl.get("common.columns.title.modify")}
                        </Button>
                        <Popconfirm
                            title={intl.get(
                                "common.columns.title.delete.notice"
                            )}
                            onConfirm={() => this.deleteField(record.field)}
                        >
                            <Button size="small">
                                {intl.get("common.columns.title.delete")}
                            </Button>
                        </Popconfirm>
                    </Space>
                </div>
            ),
        },
    ];
    /**
     * table layout
     *
     * @memberof HostKeyHash
     */
    layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    /**
     *表格临时数据
     *
     * @memberof HostKeyHash
     */
    tableDataTmp = [];
    /**
     * state
     *
     * @memberof HostKeyHash
     */
    state = {
        // table 数据
        data: [],
        // table 分页
        pagination: {
            pageSize: 15,
            current: 1,
            total: 15,
            simple: false,
            size: "default",
        },
        // table 加载状态
        loading: false,
        // table 新增修改的对话框
        modal: { visible: false, type: 0 },
        // table 搜索key
        search: { field: "*" },
        total: 0,
    };
    /**
     * 新增或修改form
     *
     * @memberof HostKeyHash
     */
    addOrUpdateModalFormInitValues = {
        field: "",
        value: "",
    };
    /**
     * 刷新数据-子组件HostKeyHeader会使用
     *
     * @param {*} redisKey
     * @memberof HostKeyHash
     */
    refreshValue(redisKey) {
        let redis = this.props.node.redis;
        redis.hlen(redisKey).then(
            (value) => {
                this.setState({ total: value });
                let pagination = this.state.pagination;
                pagination.total = value;
                this.setState({
                    pagination: pagination,
                });
                this.searchField(this.state.search.field);
            },
            (err) => {
                message.error("" + err);
                Log.error(
                    "[cmd=HostKeyHash] refreshValue error",
                    redisKey,
                    err
                );
            }
        );
    }
    /**
     * 分页切换
     *
     * @memberof HostKeyHash
     */
    handleTableChange = (pagination, filters, sorter) => {
        let current = pagination.current;
        let pageSize = pagination.pageSize;
        let startIndex = (current - 1) * pageSize;
        let endIndex = current * pageSize;
        let tableDataTmpLength = this.tableDataTmp.length;
        if (endIndex > tableDataTmpLength) {
            endIndex = tableDataTmpLength;
        }
        let pageData = this.tableDataTmp.slice(startIndex, endIndex);
        this.setState({ data: pageData });
        this.setState({
            pagination: pagination,
        });
    };
    /**
     *搜索 field
     *
     * @param {*} field
     * @memberof HostKeyHash
     */
    searchField(field) {
        this.tableDataTmp = [];
        this.setState(
            {
                data: [],
            },
            () => {
                let pattern;
                if (field.indexOf("*") === -1) {
                    pattern = "*" + field + "*";
                } else {
                    pattern = field;
                }
                let cursor = 0;
                let maxRecords = REDIS_DATA_SHOW.FETCH_DATA_SIZE;
                this.searchByPatternRecursive(pattern, cursor, maxRecords);
            }
        );
    }
    /**
     *
     * 递归搜索
     * @param {*} pattern
     * @param {*} cursor
     * @param {*} maxRecords
     * @memberof HostKeyHash
     */
    searchByPatternRecursive(pattern, cursor, maxRecords) {
        if (this.refs.hostKeyHeader === undefined) {
            // 快速切换导致组件销毁
            return;
        }
        this.setState({ loading: true });
        let redis = this.props.node.redis;
        let redisKey = this.refs.hostKeyHeader.getRedisKey();
        redis.hscan(
            redisKey,
            cursor,
            "MATCH",
            pattern,
            "COUNT",
            maxRecords,
            (err, res) => {
                if (err) {
                    message.error("" + err);
                    Log.error(
                        "[cmd=HostKeyHash] searchByPatternRecursive error",
                        redisKey,
                        cursor,
                        pattern,
                        err
                    );
                    this.setState({ loading: false });
                    return;
                }
                let data = [];
                let list = res[1];
                for (let i = 0; i < list.length; i += 2) {
                    data.push({
                        key: uuid.v4(),
                        field: list[i],
                        value: list[i + 1],
                    });
                }
                let dataTmp = [...this.tableDataTmp, ...data];
                if (dataTmp.length > REDIS_DATA_SHOW.MAX_SEARCH_DATA_SIZE) {
                    dataTmp = dataTmp.slice(
                        0,
                        REDIS_DATA_SHOW.MAX_SEARCH_DATA_SIZE
                    );
                }
                this.tableDataTmp = dataTmp;
                if (
                    res[0] !== "0" &&
                    this.state.data.length <
                        REDIS_DATA_SHOW.MAX_SEARCH_DATA_SIZE
                ) {
                    this.searchByPatternRecursive(pattern, res[0], maxRecords);
                } else {
                    let tableDataTmpLength = this.tableDataTmp.length;
                    let firstPageData = this.tableDataTmp.slice(
                        0,
                        tableDataTmpLength < 10 ? tableDataTmpLength : 10
                    );
                    this.setState({ data: firstPageData });
                    this.setState({
                        pagination: {
                            current: 1,
                            total: tableDataTmpLength,
                        },
                    });
                    this.setState({ loading: false });
                }
            }
        );
    }
    /**
     *删除 member
     *
     * @param {*} member
     * @memberof HostKeyHash
     */
    deleteField(field) {
        if (this.refs.hostKeyHeader === undefined) {
            // 快速切换导致组件销毁
            return;
        }
        let redis = this.props.node.redis;
        let redisKey = this.refs.hostKeyHeader.getRedisKey();
        redis.hdel(redisKey, field).then(
            (value) => {
                this.refreshValue(redisKey);
            },
            (err) => {
                message.error("" + err);
                Log.error("[cmd=HostKeyHash] deleteField error", redisKey, err);
            }
        );
    }
    /**
     *打开新增对话框
     *
     * @memberof HostKeyHash
     */
    openAddModal() {
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        form.resetFields();
        this.setState({ modal: { visible: true, type: 0 } });
    }
    /**
     *打开修改对话框
     *
     * @memberof HostKeyHash
     */
    openUpdateModal(data) {
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        form.resetFields();
        Object.keys(form.getFieldsValue()).forEach((key) => {
            const obj = {};
            if (data[key]) {
                obj[key] = data[key] || null;
            }
            let autoFormatJson =
                LocaleUtils.readSystemConfig(false).autoFormatJson;
            if (autoFormatJson) {
                try {
                    let formatJson = JSON.stringify(
                        JSON.parse(obj.value),
                        null,
                        4
                    );
                    obj.value = formatJson;
                } catch (error) {
                    // 非json格式，忽略
                }
            }
            form.setFieldsValue(obj);
        });
        this.setState({ modal: { visible: true, type: 1 } });
    }
    /**
     *确定新增或修改的对话框
     *
     * @memberof HostKeyHash
     */
    handleModalOk() {
        if (this.refs.hostKeyHeader === undefined) {
            // 快速切换导致组件销毁
            return;
        }
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        let field = form.getFieldValue("field");
        let value = form.getFieldValue("value");
        let redis = this.props.node.redis;
        let redisKey = this.refs.hostKeyHeader.getRedisKey();
        redis.hset(redisKey, field, value).then(
            (value) => {
                // 关闭modal
                this.setState({ modal: { visible: false } });
                if (this.refs.hostKeyHeader === undefined) {
                    // 快速切换导致组件销毁
                    return;
                }
                // 搜索
                let redisKey = this.refs.hostKeyHeader.getRedisKey();
                this.refreshValue(redisKey);
            },
            (err) => {
                message.error("" + err);
                Log.error("[cmd=HostKeyHash] handleModalOk error", err);
            }
        );
    }
    /**
     *取消对话框
     *
     * @memberof HostKeyHash
     */
    handleModalCancel() {
        // 关闭modal
        this.setState({ modal: { visible: false } });
    }
    /**
     *搜索框输入
     *
     * @param {*} event
     * @memberof HostKeyHash
     */
    onChangeSearch(event) {
        let search = this.state.search;
        search.field = event.target.value;
        this.setState({ search: search });
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
    render() {
        return (
            <div>
                <Space
                    size="small"
                    direction="vertical"
                    style={{ width: "100%" }}
                >
                    <div>
                        <Tag color="#1890ff">type: hash</Tag>
                        <Tag color="#1890ff">total: {this.state.total}</Tag>
                    </div>
                    <HostKeyHeader
                        ref="hostKeyHeader"
                        redisKey={this.props.redisKey}
                        node={this.props.node}
                        deleteKey={this.props.deleteKey.bind(this)}
                        refreshValue={this.refreshValue.bind(this)}
                    ></HostKeyHeader>
                    <Tooltip
                        placement="right"
                        title={intl.get("common.search.tooltip.limit")}
                    >
                        <Search
                            style={{ width: 300 }}
                            prefix="key :"
                            enterButton="Search"
                            size="middle"
                            value={this.state.search.field}
                            onChange={this.onChangeSearch.bind(this)}
                            onSearch={this.searchField.bind(this)}
                            loading={this.state.loading}
                        />
                    </Tooltip>
                    <Button
                        size="middle"
                        onClick={this.openAddModal.bind(this)}
                    >
                        {intl.get("common.modal.title.add")}
                    </Button>
                    <Table
                        columns={this.columns}
                        dataSource={this.state.data}
                        bordered={true}
                        size="small"
                        pagination={this.state.pagination}
                        onChange={this.handleTableChange.bind(this)}
                        loading={this.state.loading}
                        rowClassName={this.renderRowClassName.bind(this)}
                    />
                </Space>
                <Modal
                    title={
                        this.state.modal.type === 0
                            ? intl.get("common.modal.title.add")
                            : intl.get("common.modal.title.modify")
                    }
                    visible={this.state.modal.visible}
                    onOk={this.handleModalOk.bind(this)}
                    onCancel={this.handleModalCancel.bind(this)}
                    forceRender={true}
                    width={"60%"}
                    height={"40%"}
                >
                    <Form
                        {...this.layout}
                        initialValues={{
                            ...this.addOrUpdateModalFormInitValues,
                        }}
                        ref="form"
                    >
                        <Form.Item
                            name="field"
                            label="field"
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
                            name="value"
                            label="value"
                            rules={[
                                {
                                    required: true,
                                    message: intl.get(
                                        "common.error.input.value"
                                    ),
                                },
                            ]}
                        >
                            <QuickMonacoEditor height="40vh" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default HostKeyHash;
