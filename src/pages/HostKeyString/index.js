import React, { Component } from "react";
import { Button, Space, Form, message, Tag } from "antd";
import HostKeyHeader from "@/pages/HostKeyHeader";
import Log from "@/services/LogService";
import QuickMonacoEditor from "@/components/QuickMonacoEditor";
import intl from "react-intl-universal";
import LocaleUtils from "@/utils/LocaleUtils";

/**
 *hostkey-string-管理
 *
 * @class HostKeyString
 * @extends {Component}
 */
class HostKeyString extends Component {
    initValues = { value: "" };
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
     * 刷新 value
     */
    refreshValue(redisKey) {
        let redis = this.props.node.redis;
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        redis.get(redisKey).then(
            (value) => {
                let autoFormatJson =
                    LocaleUtils.readSystemConfig(false).autoFormatJson;
                if (autoFormatJson) {
                    try {
                        let formatJson = JSON.stringify(
                            JSON.parse(value),
                            null,
                            4
                        );
                        value = formatJson;
                    } catch (error) {
                        // 非json格式，忽略
                    }
                }
                form.setFieldsValue({ value: value });
            },
            (err) => {
                message.error("" + err);
                Log.error("HostKeyString refreshValue error", err);
            }
        );
    }
    /**
     * 保存值
     */
    saveValue() {
        // 取form的redisKey值
        let redisKey =
            this.refs.hostKeyHeader.refs.form.getFieldValue("redisKey");
        if (redisKey === "") {
            // 如果没有输入，则提示
            message.error(intl.get("HostKey.String.save.input.key"));
            return;
        }
        // 更新 state oldRedisKey
        this.refs.hostKeyHeader.setState({ oldRedisKey: redisKey });
        let redis = this.props.node.redis;
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        let newValue = form.getFieldValue("value");
        redis.set(redisKey, newValue).then(
            (value) => {
                message.info(intl.get("common.save.success"));
            },
            (err) => {
                message.error("" + err);
                Log.error("HostKeyString saveValue error", err);
            }
        );
    }
    render() {
        return (
            <div>
                <Space
                    size="small"
                    direction="vertical"
                    style={{ width: "100%" }}
                >
                    <Tag color="#1890ff">type: string</Tag>
                    <HostKeyHeader
                        ref="hostKeyHeader"
                        redisKey={this.props.redisKey}
                        node={this.props.node}
                        deleteKey={this.props.deleteKey.bind(this)}
                        refreshValue={this.refreshValue.bind(this)}
                    ></HostKeyHeader>
                    <Form initialValues={{ ...this.initValues }} ref="form">
                        <Form.Item name="value">
                            <QuickMonacoEditor
                                height="60vh"
                                language="json"
                                saveValue={this.saveValue.bind(this)}
                            />
                        </Form.Item>
                    </Form>
                    <Button onClick={this.saveValue.bind(this)}>
                        {intl.get("common.save")}
                    </Button>
                </Space>
            </div>
        );
    }
}

export default HostKeyString;
