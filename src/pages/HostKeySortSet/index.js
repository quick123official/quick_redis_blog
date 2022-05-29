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
import BufferUtils from "@/utils/BufferUtils";
import "@/pages/CommonCss/zebra.css";
import Log from "@/services/LogService";
import { REDIS_DATA_SHOW } from "@/utils/constant";
import uuid from "node-uuid";
import QuickMonacoEditor from "@/components/QuickMonacoEditor";
import intl from "react-intl-universal";
import LocaleUtils from "@/utils/LocaleUtils";
const { Search } = Input;
/**
 * HostKeySortSet-管理
 *
 * @class HostKeySortSet
 * @extends {Component}
 */

class HostKeySortSet extends Component {
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
            this.props = prevProps;
            let redisKey = this.props.redisKey;
            this.refreshValue(redisKey);
        }
    }
    /**
     * table columns
     *
     * @memberof HostKeySortSet
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
            width: "40%",
            ellipsis: "true",
        },
        {
            title: "score",
            dataIndex: "score",
            width: "30%",
            ellipsis: "true",
            sorter: (a, b) => a.score - b.score,
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
                            onConfirm={() => this.deleteMember(record.member)}
                        >
                            <Button size="small">
                                {" "}
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
     * @memberof HostKeySortSet
     */
    layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    /**
     * state
     *
     * @memberof HostKeySortSet
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
        search: { searchMember: "", isSearchIng: false },
        total: 0,
    };
    /**
     * 新增或修改form
     *
     * @memberof HostKeySortSet
     */
    addOrUpdateModalFormInitValues = { member: "", score: 1 };
    /**
     * 刷新数据-子组件HostKeyHeader会使用
     *
     * @param {*} redisKey
     * @memberof HostKeySortSet
     */
    refreshValue(redisKey) {
        this.setState({ search: { searchMember: "", isSearchIng: false } });
        let redis = this.props.node.redis;
        redis.zcard(redisKey).then(
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
                Log.error("HostKeySortSet refreshValue error", err);
            }
        );
    }
    /**
     *分页获取数据
     *
     * @param {*} redisKey
     * @param {*} current
     * @memberof HostKeySortSet
     */
    fetchDataByPage(redisKey, current) {
        this.setState({ loading: true });
        let redis = this.props.node.redis;
        let pageSize = this.state.pagination.pageSize;
        let startIndex = (current - 1) * pageSize;
        let endIndex = startIndex + pageSize - 1;
        redis
            .zrevrangeBuffer([redisKey, startIndex, endIndex, "WITHSCORES"])
            .then(
                (list) => {
                    let data = [];
                    for (let i = 0; i < list.length; i += 2) {
                        data.push({
                            key: uuid.v4(),
                            score: Number(list[i + 1]),
                            member: BufferUtils.bufferToString(list[i]),
                            binaryM: BufferUtils.bufferVisible(list[i]),
                        });
                    }
                    this.setState({ data: data });
                    this.setState({ loading: false });
                },
                (err) => {
                    message.error("" + err);
                    Log.error("HostKeySortSet fetchDataByPage error", err);
                    this.setState({ loading: false });
                }
            );
    }
    /**
     * 分页切换
     *
     * @memberof HostKeySortSet
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
                if (this.state.search.isSearchIng === false) {
                    this.fetchDataByPage(redisKey, pagination.current);
                }
            }
        );
    };
    /**
     *搜索 key
     *
     * @param {*} searchKey
     * @memberof HostKeySortSet
     */
    searchSortSet(searchMember) {
        if (this.refs.hostKeyHeader === undefined) {
            // 快速切换导致组件销毁
            return;
        }
        if (searchMember === "") {
            let redisKey = this.refs.hostKeyHeader.getRedisKey();
            this.refreshValue(redisKey);
            return;
        }
        let search = this.state.search;
        search.searchMember = searchMember;
        search.isSearchIng = true;
        this.setState({ search: search });
        this.setState(
            {
                data: [],
            },
            () => {
                let pattern = "*" + searchMember + "*";
                let cursor = 0;
                let maxRecords = REDIS_DATA_SHOW.FETCH_DATA_SIZE;
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
     * @memberof HostKeySortSet
     */
    searchSortSetByPatternRecursive(pattern, cursor, maxRecords) {
        if (this.refs.hostKeyHeader === undefined) {
            // 快速切换导致组件销毁
            return;
        }
        this.setState({ loading: true });
        let redis = this.props.node.redis;
        let redisKey = this.refs.hostKeyHeader.getRedisKey();
        redis.zscan(
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
                        "HostKeySortSet searchSortSetByPatternRecursive error",
                        err
                    );
                    return;
                }
                let data = [];
                let list = res[1];
                for (let i = 0; i < list.length; i += 2) {
                    data.push({
                        key: uuid.v4(),
                        score: Number(list[i + 1]),
                        member: list[i],
                        binaryM: list[i],
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
                if (res[0] !== "0" && this.state.data.length < 1000) {
                    this.searchSortSetByPatternRecursive(
                        pattern,
                        res[0],
                        maxRecords
                    );
                } else {
                    this.setState({ loading: false });
                }
            }
        );
    }
    /**
     *删除 member
     *
     * @param {*} member
     * @memberof HostKeySortSet
     */
    deleteMember(member) {
        if (this.refs.hostKeyHeader === undefined) {
            // 快速切换导致组件销毁
            return;
        }
        let redis = this.props.node.redis;
        let redisKey = this.refs.hostKeyHeader.getRedisKey();
        redis.zrem(redisKey, member).then(
            (value) => {
                // 判断搜索
                this.judgeSearchOnEvent();
            },
            (err) => {
                message.error("" + err);
                Log.error("HostKeySortSet deleteMember error", err);
            }
        );
    }
    /**
     *打开新增对话框
     *
     * @memberof HostKeySortSet
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
     * @memberof HostKeySortSet
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
            let autoFormatJson =
                LocaleUtils.readSystemConfig(false).autoFormatJson;
            if (autoFormatJson) {
                try {
                    let formatJson = JSON.stringify(
                        JSON.parse(obj.member),
                        null,
                        4
                    );
                    obj.member = formatJson;
                } catch (error) {
                    // 非json格式，忽略
                }
            }
            form.setFieldsValue(obj);
        });
        this.setState({ modal: { visible: true, type: 1 } });
    }
    /**
     * 一些事件操作之后，判断搜索的方法
     */
    judgeSearchOnEvent() {
        this.setState({ loading: true });
        try {
            if (this.state.search.isSearchIng) {
                this.searchSortSet(this.state.search.searchMember);
            } else {
                this.fetchDataByPage(
                    this.refs.hostKeyHeader.getRedisKey(),
                    this.state.pagination.current
                );
            }
        } catch (e) {
            this.setState({ loading: false });
            Log.error("HostKeySortSet.judgeSearchOnEvent", e);
        }
    }
    /**
     *确定新增或修改的对话框
     *
     * @memberof HostKeySortSet
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
        let score = form.getFieldValue("score");
        let redis = this.props.node.redis;
        let redisKey = this.refs.hostKeyHeader.getRedisKey();
        redis.zadd(redisKey, score, member).then(
            (value) => {
                // 关闭modal
                this.setState({ modal: { visible: false } });
                // 判断搜索
                this.judgeSearchOnEvent();
                // 清空form
                this.addOrUpdateModalFormInitValues = {
                    member: "",
                    score: 1,
                };
            },
            (err) => {
                message.error("" + err);
                Log.error("HostKeySortSet deleteMember error", err);
            }
        );
    }
    /**
     *取消对话框
     *
     * @memberof HostKeySortSet
     */
    handleModalCancel() {
        // 关闭modal
        this.setState({ modal: { visible: false } });
        // 清空form
        this.addOrUpdateModalFormInitValues = { member: "", score: 1 };
    }
    /**
     *搜索框输入
     *
     * @param {*} event
     * @memberof HostKeySortSet
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
                        <Tag color="#1890ff">type: zset</Tag>
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
                            value={this.state.search.searchMember}
                            onChange={this.onChangeSearchMember.bind(this)}
                            onSearch={this.searchSortSet.bind(this)}
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
                            <QuickMonacoEditor height="40vh" />
                        </Form.Item>
                        <Form.Item
                            name="score"
                            label="score"
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
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default HostKeySortSet;
