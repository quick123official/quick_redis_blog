import React, { Component } from "react";
import {
    Input,
    Button,
    Space,
    message,
    Form,
    Popconfirm,
    Row,
    Col,
} from "antd";
import {
    ReloadOutlined,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import Log from "@/services/LogService";
import intl from "react-intl-universal";
import BufferUtils from "@/utils/BufferUtils";
const { Search } = Input;

/**
 *hostkey-管理-HostKeyHeader
 *
 * @class HostKeyHeader
 * @extends {Component}
 */
class HostKeyHeader extends Component {
    /**
     *
     * 说明：oldRedisKey为空，表示新建且没有保存key。
     * @memberof HostKeyHeader
     */
    state = { oldRedisKey: "" };

    initValues = { redisKey: "", ttl: -1 };
    /**
     * 只执行一次。第一次渲染后调用，只在客户端
     */
    componentDidMount() {
        this.initKeyAndTtl();
    }
    /**
     * 在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
     *
     * @param {*} nextProps
     * @memberof HostKeyString
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.redisKey !== nextProps.redisKey) {
            this.props = nextProps;
            this.initKeyAndTtl();
        }
    }
    /**
     * 刷新key和ttl
     */
    initKeyAndTtl() {
        let redis = this.props.node.redis;
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        let redisKey = this.props.redisKey;
        this.setState({ oldRedisKey: redisKey });
        form.setFieldsValue({ redisKey: redisKey });
        redis.ttl(redisKey).then(
            (value) => {
                if (value === -2) {
                    value = -1;
                }
                let form = this.refs.form;
                if (form === undefined) {
                    return;
                }
                form.setFieldsValue({ ttl: value });
            },
            (err) => {
                message.error("" + err);
                Log.error(
                    "[cmd=HostKeyHeader] initKeyAndTtl error",
                    redisKey,
                    err
                );
            }
        );
    }
    /**
     * 删除key
     */
    deleteKey() {
        if (this.state.oldRedisKey === "") {
            message.error(intl.get("HostKey.header.save.notice"));
            return;
        }
        let redis = this.props.node.redis;
        let keyBuffer = BufferUtils.hexToBuffer(this.state.oldRedisKey);
        redis.del(keyBuffer).then(
            (value) => {
                this.setState({ oldRedisKey: "" });
                let form = this.refs.form;
                if (form === undefined) {
                    return;
                }
                form.setFieldsValue({ redisKey: "" });
                form.setFieldsValue({ ttl: -1 });
                this.props.deleteKey();
                message.info(intl.get("HostKey.header.save.delete.success"));
            },
            (err) => {
                message.error("" + err);
                Log.error(
                    "[cmd=HostKeyHeader] initKeyAndTtl error",
                    this.state.oldRedisKey,
                    err
                );
            }
        );
    }
    /**
     * 重命名key
     */
    renameKey() {
        let redis = this.props.node.redis;
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        let newKey = form.getFieldValue("redisKey");
        let newKeyBuffer = BufferUtils.hexToBuffer(newKey);
        redis.type(newKeyBuffer, (err, retKeyType) => {
            if (err) {
                message.error("" + err);
                Log.error("[cmd=HostKeyHeader] renameKey error", newKey, err);
                return;
            }
            if (retKeyType !== "none") {
                message.error(
                    intl.get("HostKey.header.key.modify.fail.exist") +
                        ", key > " +
                        newKey
                );
                return;
            }
            let oldRedisKeyBuffer = BufferUtils.hexToBuffer(
                this.state.oldRedisKey
            );
            redis.rename(oldRedisKeyBuffer, newKeyBuffer).then(
                (value) => {
                    this.setState({
                        oldRedisKey: newKey,
                    });
                    message.success(
                        intl.get("HostKey.header.key.modify.success")
                    );
                },
                (error) => {
                    message.error(
                        intl.get("HostKey.header.key.modify.fail") + " " + error
                    );
                }
            );
        });
    }
    /**
     *更新 ttl
     *
     * @memberof HostKeyHeader
     */
    updateTtl() {
        if (this.state.oldRedisKey === "") {
            message.error(intl.get("HostKey.header.save.notice"));
            return;
        }
        let redis = this.props.node.redis;
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        let ttl = form.getFieldValue("ttl");
        try {
            ttl = Number.parseInt(ttl);
        } catch (e) {
            message.error(
                intl.get("HostKey.header.key.ttl.midify.illegal.value")
            );
            return;
        }
        if (isNaN(ttl)) {
            message.error(
                intl.get("HostKey.header.key.ttl.midify.illegal.value")
            );
            return;
        }
        let newKeyBuffer = BufferUtils.hexToBuffer(this.state.oldRedisKey);
        if (ttl === -1) {
            redis.persist(newKeyBuffer).then(
                (res) => {
                    this.setState({ ttl: this.state.ttl });
                    message.info(
                        intl.get("HostKey.header.key.ttl.midify.success")
                    );
                },
                (err) => {
                    message.error(
                        intl.get("HostKey.header.key.ttl.midify.fail") + err
                    );
                    Log.error(
                        "[cmd=HostKeyHeader] updateTtl persist error",
                        this.state.oldRedisKey,
                        err
                    );
                }
            );
            return;
        }
        if (ttl <= 5) {
            message.error(
                intl.get("HostKey.header.key.ttl.midify.illegal.value.2")
            );
            return;
        }
        form.setFieldsValue({ ttl: ttl });
        redis.expire(newKeyBuffer, ttl).then(
            (res) => {
                this.setState({ ttl: this.state.ttl });
                message.info(intl.get("HostKey.header.key.ttl.midify.success"));
            },
            (err) => {
                message.error(
                    intl.get("HostKey.header.key.ttl.midify.fail") + err
                );
                Log.error(
                    "[cmd=HostKeyHeader] updateTtl error",
                    this.state.oldRedisKey,
                    err
                );
            }
        );
    }
    /**
     *刷新key、ttl、value
     *
     * @memberof HostKeyHeader
     */
    refreshAll() {
        let oldRedisKey = this.state.oldRedisKey;
        if (oldRedisKey === "") {
            message.error(intl.get("HostKey.header.save.notice"));
            return;
        }
        let redis = this.props.node.redis;
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        form.setFieldsValue({ redisKey: oldRedisKey });
        let newKeyBuffer = BufferUtils.hexToBuffer(this.state.oldRedisKey);
        redis.ttl(newKeyBuffer).then(
            (value) => {
                this.setState({ ttl: value });
                form.setFieldsValue({ ttl: value });
            },
            (err) => {
                message.error("" + err);
                Log.error(
                    "[cmd=HostKeyHeader] refreshAll error",
                    oldRedisKey,
                    err
                );
            }
        );
        this.props.refreshValue(oldRedisKey);
    }
    /**
     *获取 redis key
     *
     * @memberof HostKeyHeader
     */
    getRedisKey() {
        return this.state.oldRedisKey;
    }
    render() {
        return (
            <div>
                <Form initialValues={{ ...this.initValues }} ref="form">
                    <Row gutter={8}>
                        <Col span={14}>
                            <Form.Item
                                name="redisKey"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                style={{ marginBottom: "1px" }}
                            >
                                <Search
                                    prefix="key :"
                                    enterButton={
                                        <Button
                                            icon={<EditOutlined />}
                                        ></Button>
                                    }
                                    size="middle"
                                    onSearch={this.renameKey.bind(this)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                name="ttl"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                style={{ marginBottom: "1px" }}
                            >
                                <Search
                                    prefix="ttl :"
                                    enterButton={
                                        <Button
                                            icon={<EditOutlined />}
                                        ></Button>
                                    }
                                    size="middle"
                                    onSearch={this.updateTtl.bind(this)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Space>
                                <Form.Item style={{ marginBottom: "1px" }}>
                                    <Popconfirm
                                        title={intl.get(
                                            "HostKey.header.key.delete.notice"
                                        )}
                                        onConfirm={() => {
                                            this.deleteKey();
                                        }}
                                    >
                                        <Button
                                            icon={<DeleteOutlined />}
                                        ></Button>
                                    </Popconfirm>
                                </Form.Item>
                                <Form.Item style={{ marginBottom: "1px" }}>
                                    <Button
                                        icon={<ReloadOutlined />}
                                        onClick={this.refreshAll.bind(this)}
                                    ></Button>
                                </Form.Item>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default HostKeyHeader;
