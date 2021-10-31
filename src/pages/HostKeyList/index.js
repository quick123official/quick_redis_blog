import React, { Component } from "react";
import {
    Button,
    Table,
    Popconfirm,
    Space,
    message,
    Modal,
    Form,
    Tag,
    Select,
} from "antd";
import HostKeyHeader from "@/pages/HostKeyHeader";
import "@/pages/CommonCss/zebra.css";
import uuid from "node-uuid";
import Log from "@/services/LogService";
import QuickMonacoEditor from "@/components/QuickMonacoEditor";
import intl from "react-intl-universal";
const { Option } = Select;
/**
 * HostKeyList-管理
 *
 * @class HostKeyList
 * @extends {Component}
 */

class HostKeyList extends Component {
    /**
     * 只执行一次。第一次渲染后调用，只在客户端
     */
    componentDidMount() {
        let redisKey = this.props.redisKey;
        this.refreshValue(redisKey);
    }
    /**
     *组件更新
     *
     * @param {*} prevProps
     * @memberof HostKeyString
     */
    componentDidUpdate(prevProps) {
        if (this.props.redisKey !== prevProps.redisKey) {
            let redisKey = this.props.redisKey;
            this.refreshValue(redisKey);
        }
    }
    /**
     * table columns
     *
     * @memberof HostKeyList
     */
    columns = [
        {
            title: "id",
            dataIndex: "key",
            width: "10%",
            render: (text, record, index) => `${index + 1}`,
        },
        {
            title: "value",
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
     * @memberof HostKeyList
     */
    layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    /**
     * state
     *
     * @memberof HostKeyList
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
        total: 0,
    };
    /**
     * 新增或修改form
     *
     * @memberof HostKeyList
     */
    addOrUpdateModalFormInitValues = { member: "", insertType: "0" };
    /**
     * 刷新数据-子组件HostKeyHeader会使用
     *
     * @param {*} redisKey
     * @memberof HostKeyList
     */
    refreshValue(redisKey) {
        let redis = this.props.node.redis;
        redis.llen(redisKey).then(
            (value) => {
                this.setState({ total: value });
                let pagination = this.state.pagination;
                pagination.total = value;
                this.setState({
                    pagination: pagination,
                });
                this.fetchDataByPage(redisKey, 1);
            },
            (err) => {
                message.error("" + err);
                Log.error("[cmd=HostKeyList] refreshValue error", err);
            }
        );
    }
    /**
     *分页获取数据
     *
     * @param {*} redisKey
     * @param {*} current
     * @memberof HostKeyList
     */
    fetchDataByPage(redisKey, current) {
        this.setState({ loading: true });
        let redis = this.props.node.redis;
        let pageSize = this.state.pagination.pageSize;
        let startIndex = (current - 1) * pageSize;
        let endIndex = startIndex + pageSize - 1;
        redis.lrange(redisKey, startIndex, endIndex, (err, list) => {
            if (err) {
                message.error("" + err);
                Log.error("[cmd=HostKeyList] fetchDataByPage error", err);
                return;
            }
            let data = [];
            for (let i = 0; i < list.length; i++) {
                data.push({
                    key: uuid.v4(),
                    member: list[i],
                });
            }
            this.setState({ data: data });
            this.setState({ loading: false });
        });
    }
    /**
     * 分页切换
     *
     * @memberof HostKeyList
     */
    handleTableChange = (pagination, filters, sorter) => {
        if (this.refs.hostKeyHeader === undefined) {
            // 快速切换导致组件销毁
            return;
        }
        let redisKey = this.refs.hostKeyHeader.getRedisKey();
        this.setState(
            {
                pagination: pagination,
            },
            () => {
                this.fetchDataByPage(redisKey, pagination.current);
            }
        );
    };
    /**
     *删除 member
     *
     * @param {*} member
     * @memberof HostKeyList
     */
    deleteMember(member) {
        if (this.refs.hostKeyHeader === undefined) {
            // 快速切换导致组件销毁
            return;
        }
        let redis = this.props.node.redis;
        let redisKey = this.refs.hostKeyHeader.getRedisKey();
        // 执行删除
        redis.lrem(redisKey, 1, member).then(
            (value) => {
                // 查询总数
                redis.llen(redisKey).then((value) => {
                    this.setState({ total: value });
                });
                this.fetchDataByPage(
                    this.refs.hostKeyHeader.getRedisKey(),
                    this.state.pagination.current
                );
            },
            (err) => {
                message.error("" + err);
                Log.error("[cmd=HostKeyList] deleteMember error", err);
            }
        );
    }
    /**
     *打开新增对话框
     *
     * @memberof HostKeyList
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
     * @memberof HostKeyList
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
    pushMemberCallBack(redisKey) {
        // 关闭modal
        this.setState({ modal: { visible: false } });
        // 查询总数
        let redis = this.props.node.redis;
        redis.llen(redisKey).then(
            (value) => {
                this.setState({ total: value });
            },
            (err) => {
                message.error("" + err);
                Log.error("[cmd=HostKeyList] handleModalOk llen error", err);
            }
        );
        // 搜索
        this.fetchDataByPage(
            this.refs.hostKeyHeader.getRedisKey(),
            this.state.pagination.current
        );
        // 清空form
        this.addOrUpdateModalFormInitValues.member = "";
    }
    /**
     *确定新增或修改的对话框
     *
     * @memberof HostKeyList
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
        let insertType = form.getFieldValue("insertType");
        let redis = this.props.node.redis;
        let redisKey = this.refs.hostKeyHeader.getRedisKey();
        if (insertType === "0") {
            redis
                .lpush(redisKey, member)
                .then(this.pushMemberCallBack(redisKey), (err) => {
                    message.error("" + err);
                    Log.error("[cmd=HostKeyList] handleModalOk lpush error", err);
                });
        } else if (insertType === "1") {
            redis
                .rpush(redisKey, member)
                .then(this.pushMemberCallBack(redisKey), (err) => {
                    message.error("" + err);
                    Log.error("[cmd=HostKeyList] handleModalOk rpush error", err);
                });
        }
    }
    /**
     *取消对话框
     *
     * @memberof HostKeyList
     */
    handleModalCancel() {
        // 关闭modal
        this.setState({
            modal: {
                forceRender: true,
                visible: false,
                type: this.state.modal.type,
            },
        });
        // 清空form
        this.addOrUpdateModalFormInitValues.member = "";
    }
    /**
     *搜索框输入
     *
     * @param {*} event
     * @memberof HostKeyList
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
                        <Tag color="#1890ff">type: list</Tag>
                        <Tag color="#1890ff">total: {this.state.total}</Tag>
                    </div>
                    <HostKeyHeader
                        ref="hostKeyHeader"
                        redisKey={this.props.redisKey}
                        node={this.props.node}
                        deleteKey={this.props.deleteKey.bind(this)}
                        refreshValue={this.refreshValue.bind(this)}
                    ></HostKeyHeader>
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
                            : intl.get("common.modal.title.view")
                    }
                    visible={this.state.modal.visible}
                    onOk={this.handleModalOk.bind(this)}
                    onCancel={this.handleModalCancel.bind(this)}
                    okButtonProps={{ disabled: this.state.modal.type === 1 }}
                    forceRender={this.state.modal.forceRender}
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
                            name="insertType"
                            label={intl.get(
                                "HostKey.HostKeyList.modal.insert.position"
                            )}
                            style={{
                                display:
                                    this.state.modal.type === 0 ? "" : "none",
                            }}
                        >
                            <Select style={{ width: 120 }}>
                                <Option value="0">
                                    {intl.get(
                                        "HostKey.HostKeyList.modal.insert.left"
                                    )}
                                </Option>
                                <Option value="1">
                                    {intl.get(
                                        "HostKey.HostKeyList.modal.insert.right"
                                    )}
                                </Option>
                            </Select>
                        </Form.Item>
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

export default HostKeyList;
