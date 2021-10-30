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
const { Search } = Input;
/**
 * HostKeySet-管理
 *
 * @class HostKeySet
 * @extends {Component}
 */

class HostKeySet extends Component {
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
     * @memberof HostKeyString
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        let redisKey = this.props.redisKey;
        this.refreshValue(redisKey);
    }
    /**
     * table columns
     *
     * @memberof HostKeySet
     */
    columns = [
        {
            title: "id",
            dataIndex: "key",
            width: "10%",
            render: (text, record, index) => `${index + 1}`,
        },
        {
            title: "member",
            dataIndex: "member",
            width: "70%",
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
                            {intl.get("common.columns.title.view")}
                        </Button>
                        <Popconfirm
                            title={intl.get(
                                "common.columns.title.delete.notice"
                            )}
                            onConfirm={() => this.deleteMember(record.member)}
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
     * @memberof HostKeySet
     */
    layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    /**
     * state
     *
     * @memberof HostKeySet
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
        modal: { forceRender: true, visible: false, type: 0 },
        // table 搜索key
        search: { searchMember: "*" },
        total: 0,
    };
    /**
     * 新增或修改form
     *
     * @memberof HostKeySet
     */
    addOrUpdateModalFormInitValues = { member: "" };
    /**
     * 刷新数据-子组件HostKeyHeader会使用
     *
     * @param {*} redisKey
     * @memberof HostKeySet
     */
    refreshValue(redisKey) {
        let redis = this.props.node.redis;
        redis.scard(redisKey).then(
            (value) => {
                this.setState({ total: value });
                this.searchSet(this.state.search.searchMember);
            },
            (err) => {
                message.error("" + err);
                Log.error("HostKeySet refreshValue error", err);
            }
        );
    }
    /**
     * 分页切换
     *
     * @memberof HostKeySet
     */
    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            pagination: pagination,
        });
    };
    /**
     *搜索 key
     *
     * @param {*} searchKey
     * @memberof HostKeySet
     */
    searchSet(searchMember) {
        this.setState(
            {
                data: [],
            },
            () => {
                let pattern;
                if (searchMember.indexOf("*") === -1) {
                    pattern = "*" + searchMember + "*";
                } else {
                    pattern = searchMember;
                }
                let cursor = 0;
                let maxRecords = REDIS_DATA_SHOW.MAX_SEARCH_DATA_SIZE;
                this.searchSortSetByPatternRecursive(
                    pattern,
                    cursor,
                    maxRecords
                );
            }
        );
    }
    /**
     *
     * 递归搜索sortset
     * @param {*} pattern
     * @param {*} cursor
     * @param {*} maxRecords
     * @memberof HostKeySet
     */
    searchSortSetByPatternRecursive(pattern, cursor, maxRecords) {
        if (this.refs.hostKeyHeader === undefined) {
            // 快速切换导致组件销毁
            return;
        }
        this.setState({ loading: true });
        let redis = this.props.node.redis;
        let redisKey = this.refs.hostKeyHeader.getRedisKey();
        try {
            redis.sscan(
                redisKey,
                cursor,
                "MATCH",
                pattern,
                "COUNT",
                maxRecords,
                (_, [cursor, results]) => {
                    let data = [];
                    for (let i = 0; i < results.length; i++) {
                        data.push({
                            key: uuid.v4(),
                            member: results[i],
                        });
                    }
                    let dataTmp = [...this.state.data, ...data];
                    if (dataTmp.length > REDIS_DATA_SHOW.MAX_SEARCH_DATA_SIZE) {
                        dataTmp = dataTmp.slice(
                            0,
                            REDIS_DATA_SHOW.MAX_SEARCH_DATA_SIZE
                        );
                    }
                    this.setState({ data: dataTmp });
                    this.setState({
                        pagination: {
                            current: 1,
                            total: dataTmp.length,
                        },
                    });
                    if (
                        cursor !== "0" &&
                        this.state.data.length <
                            REDIS_DATA_SHOW.MAX_SEARCH_DATA_SIZE
                    ) {
                        this.searchSortSetByPatternRecursive(
                            pattern,
                            cursor,
                            maxRecords
                        );
                    } else {
                        this.setState({ loading: false });
                    }
                }
            );
        } catch (err) {
            message.error("" + err);
            Log.error("HostKeySet searchSortSetByPatternRecursive error", err);
            this.setState({ loading: false });
        }
    }
    /**
     *删除 member
     *
     * @param {*} member
     * @memberof HostKeySet
     */
    deleteMember(member) {
        if (this.refs.hostKeyHeader === undefined) {
            // 快速切换导致组件销毁
            return;
        }
        let redis = this.props.node.redis;
        let redisKey = this.refs.hostKeyHeader.getRedisKey();
        redis.srem(redisKey, member).then(
            (value) => {
                this.refreshValue(redisKey);
            },
            (err) => {
                message.error("" + err);
                Log.error("HostKeyHeader deleteMember error", err);
            }
        );
    }
    /**
     *打开新增对话框
     *
     * @memberof HostKeySet
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
     * @memberof HostKeySet
     */
    openUpdateModal(data) {
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        Object.keys(form.getFieldsValue()).forEach((key) => {
            const obj = {};
            if (data[key]) {
                obj[key] = data[key] || null;
            }
            form.setFieldsValue(obj);
        });
        this.setState({ modal: { visible: true, type: 1 } });
    }
    /**
     *确定新增或修改的对话框
     *
     * @memberof HostKeySet
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
        let member = form.getFieldValue("member");
        let redis = this.props.node.redis;
        let redisKey = this.refs.hostKeyHeader.getRedisKey();
        redis.sadd(redisKey, member).then(
            (value) => {
                // 关闭modal
                this.setState({ modal: { visible: false } });
                // 判断搜索
                this.refreshValue(redisKey);
                // 清空form
                this.addOrUpdateModalFormInitValues = {
                    member: "",
                };
            },
            (err) => {
                message.error("" + err);
                Log.error("HostKeyHeader handleModalOk error", err);
            }
        );
    }
    /**
     *取消对话框
     *
     * @memberof HostKeySet
     */
    handleModalCancel() {
        // 关闭modal
        this.setState({ modal: { visible: false } });
        // 清空form
        this.addOrUpdateModalFormInitValues = { member: "" };
    }
    /**
     *搜索框输入
     *
     * @param {*} event
     * @memberof HostKeySet
     */
    onChangeSearchMember(event) {
        let search = this.state.search;
        search.searchMember = event.target.value;
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
                        <Tag color="#1890ff">type: set</Tag>
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
                            defaultValue="*"
                            style={{ width: 300 }}
                            prefix="key :"
                            enterButton="Search"
                            size="middle"
                            value={this.state.search.searchMember}
                            onChange={this.onChangeSearchMember.bind(this)}
                            onSearch={this.searchSet.bind(this)}
                            loading={this.state.loading}
                        />
                    </Tooltip>
                    <Button
                        size="middle"
                        onClick={this.openAddModal.bind(this)}
                    >
                        {intl.get("common.add.record")}
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
                            : intl.get("common.modal.title.view")
                    }
                    visible={this.state.modal.visible}
                    onOk={this.handleModalOk.bind(this)}
                    onCancel={this.handleModalCancel.bind(this)}
                    okButtonProps={{ disabled: this.state.modal.type === 1 }}
                    forceRender={this.state.modal.forceRender}
                    width={"90%"}
                    height={"80%"}
                >
                    <Form
                        {...this.layout}
                        initialValues={{
                            ...this.addOrUpdateModalFormInitValues,
                        }}
                        ref="form"
                    >
                        <Form.Item
                            name="member"
                            label="member"
                            rules={[
                                {
                                    required: true,
                                    message: intl.get(
                                        "common.error.input.value"
                                    ),
                                },
                            ]}
                        >
                            <QuickMonacoEditor height="60vh" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default HostKeySet;
