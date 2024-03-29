import React from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Divider,
    Button,
    message,
    Checkbox,
} from "antd";
import Log from "@/services/LogService";
import { CONNECT_TYPE } from "@/utils/constant";
import RedisService from "@/services/RedisService";
import intl from "react-intl-universal";
const { Option } = Select;
/**
 * 创建或者修改host
 *
 * @class CreateOrUpdateHostModal
 * @extends {React.Component}
 */
const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};
class CreateOrUpdateHostModal extends React.Component {

    // componentWillMount(){
    //     
    //     this.state = {
    //         proxyuse: this.props.data.proxyuse || false,
    //     };
    // }

    handleInputChange(event) {
        this.setState({
            proxyuse: !this.state.proxyuse,
        });
        this.props.data.proxyuse = !this.state.proxyuse;
    }


    state = { showMasterName: "none" };
    /**
     * 在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
     *
     * @param {*} nextProps
     * @memberof HostKeyString
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.setState({
            proxyuse: this.props.data.proxyuse || false,
        });
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        Object.keys(form.getFieldsValue()).forEach((key) => {
            const obj = {};
            obj[key] = this.props.data[key] || null;
            form.setFieldsValue(obj);
        });
        if (this.props.data.connectType === CONNECT_TYPE.SENTINEL) {
            this.setState({ showMasterName: "block" });
        } else {
            this.setState({ showMasterName: "none" });
        }
    }
    /**
     *连接类型的select组件重新选择
     *
     * @param {*} value
     * @memberof CreateOrUpdateHostModal
     */
    handleConnectTypeChange(value) {
        if (value + "" === CONNECT_TYPE.SENTINEL) {
            this.setState({ showMasterName: "block" });
        } else {
            this.setState({ showMasterName: "none" });
        }
    }
    /**
     * 连接测试
     */
    connectionTest() {
        let form = this.refs.form;
        form.validateFields()
            .then((values) => {
                let testNode = {
                    data: {
                        ...values,
                        host: values.host,
                        port: values.port,
                        auth: values.auth,
                        connectType: values.connectType,
                        masterName: values.masterName,
                        sentinelPassword: values.sentinelPassword,
                        proxyuse: this.state.proxyuse || false,
                    },
                };
                RedisService.connectRedis(testNode, undefined, undefined);
            })
            .catch((err) => {
                message.error("" + err);
                Log.error("connectionTest validateFields error", err);
            });
    }
    render() {

        return (
            <Modal
                visible={this.props.visible}
                title={
                    this.props.type === 0
                        ? intl.get("ResourceTree.host.create")
                        : intl.get("ResourceTree.host.modify")
                }
                onCancel={() => {
                    let form = this.refs.form;
                    if (form === undefined) {
                        return;
                    }
                    this.props.handleCreateOrUpdateHostModalCancel();
                    form.resetFields();
                }}
                onOk={() => {
                    let form = this.refs.form;
                    if (form === undefined) {
                        return;
                    }
                    form.validateFields()
                        .then((values) => {
                            values = {...this.props.data, ...values,proxyuse: this.props.data.proxyuse}
                            this.props.handleCreateOrUpdateHostModalOk(values);
                            form.resetFields();
                        })
                        .catch((e) => {
                            Log.error(
                                "CreateOrUpdateHostModal validateFields error",
                                e
                            );
                        });
                }}
            >
                <Form
                    ref="form"
                    {...layout}
                    initialValues={{
                        ...this.props.data,
                    }}
                >
                    <Form.Item
                        name="name"
                        label={intl.get("ResourceTree.host.name")}
                        rules={[
                            {
                                required: true,
                                message: intl.get(
                                    "ResourceTree.host.name.rules"
                                ),
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="host"
                        label={intl.get("ResourceTree.host.ip")}
                        rules={[
                            {
                                required: true,
                                message: intl.get("ResourceTree.host.ip.rules"),
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="port"
                        label={intl.get("ResourceTree.host.port")}
                        rules={[
                            {
                                required: true,
                                message: intl.get(
                                    "ResourceTree.host.port.rules"
                                ),
                            },
                        ]}
                    >
                        <InputNumber min={1} max={65535} />
                    </Form.Item>
                    <Form.Item
                        name="auth"
                        label={intl.get("ResourceTree.host.password")}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="connectType"
                        label={intl.get("ResourceTree.host.connectionMode")}
                    >
                        <Select
                            style={{ width: 120 }}
                            onChange={this.handleConnectTypeChange.bind(this)}
                        >
                            <Option value="0">
                                {intl.get(
                                    "ResourceTree.host.connectionMode.direct"
                                )}
                            </Option>
                            <Option value="1">
                                {intl.get(
                                    "ResourceTree.host.connectionMode.sentinel"
                                )}
                            </Option>
                            <Option value="2">
                                {intl.get(
                                    "ResourceTree.host.connectionMode.cluster"
                                )}
                            </Option>
                        </Select>
                    </Form.Item>
                    <div
                        style={{
                            display:
                                this.props.data.connectType ===
                                    CONNECT_TYPE.SENTINEL ||
                                    this.state.showMasterName === "block"
                                    ? "block"
                                    : "none",
                        }}
                    >
                        <Form.Item name="masterName" label="MasterName">
                            <Input />
                        </Form.Item>
                    </div>
                    <div
                        style={{
                            display:
                                this.props.data.connectType ===
                                    CONNECT_TYPE.SENTINEL ||
                                    this.state.showMasterName === "block"
                                    ? "block"
                                    : "none",
                        }}
                    >
                        <Form.Item
                            name="sentinelPassword"
                            label={intl.get(
                                "ResourceTree.host.sentinel.password"
                            )}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item
                        // name="proxyuse"
                        label={intl.get("proxy.use")}
                    >
                        <Checkbox
                            name="proxyuse"
                            checked={this.state.proxyuse || false}
                            onChange={this.handleInputChange.bind(this)}
                        ></Checkbox>
                    </Form.Item>
                    <div
                        style={{
                            display: this.state.proxyuse === true ? "block" : "none",
                        }}
                    >
                        <Form.Item
                            name="proxyhost"
                            label={intl.get("proxy.host")}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="proxysshport"
                            label={intl.get("proxy.sshport")}
                        >
                            <InputNumber min={1} max={65535} value={22} />
                        </Form.Item>
                        <Form.Item
                            name="proxyusername"
                            label={intl.get("proxy.username")}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="proxypassword"
                            label={intl.get("proxy.password")}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="proxysshkeypath"
                            label={intl.get("proxy.sshkeypath")}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item label={intl.get("ResourceTree.host.test")}>
                        <Button onClick={this.connectionTest.bind(this)}>
                            {intl.get("ResourceTree.host.test.button")}
                        </Button>
                    </Form.Item>
                    <Divider orientation="left">
                        {intl.get("ResourceTree.host.description")}：
                    </Divider>
                    <p>{intl.get("ResourceTree.host.description.detail")}</p>
                </Form>
            </Modal>
        );
    }
}
export default CreateOrUpdateHostModal;
