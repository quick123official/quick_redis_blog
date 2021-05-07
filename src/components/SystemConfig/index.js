import React from "react";
import { Modal, Row, Col, Select, Input, Tooltip } from "antd";
import LocaleUtils from "@/utils/LocaleUtils";
import intl from "react-intl-universal";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Option } = Select;
const { confirm } = Modal;
const { ipcRenderer, remote } = window.require("electron");
/**
 * 系统配置
 */
class SystemConfig extends React.Component {
    state = { visible: false, config: { lang: "", splitSign: "" } };
    componentDidMount() {
        // 重置连接事件
        ipcRenderer.on("system-config", (event, arg) => {
            this.showModal();
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
            config: LocaleUtils.readSystemConfig(),
        });
    };

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        LocaleUtils.saveSystemConfig(this.state.config);
        confirm({
            title: intl.get("common.notice"),
            icon: <ExclamationCircleOutlined />,
            content: intl.get("SystemConfig.needRestart"),
            onOk() {
                remote.app.quit();
            },
            onCancel() {},
        });
    };

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };
    /**
     *修改语言
     *
     * @param {*} val
     * @memberof SystemConfig
     */
    handleLangChange(val) {
        this.setState({
            config: { ...this.state.config, lang: val },
        });
    }
    /**
     *修改分隔符
     *
     * @memberof SystemConfig
     */
    handleSplitSignChange = (event) => {
        this.setState({
            config: { ...this.state.config, splitSign: event.target.value },
        });
    };

    render() {
        let options = LocaleUtils.LOCALES.map((l) => (
            <Option key={l.value} value={l.value}>
                {l.label}
            </Option>
        ));
        return (
            <div>
                <Modal
                    title={intl.get("SystemConfig.title")}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={6}>{intl.get("SystemConfig.lang")}</Col>
                        <Col span={18}>
                            <Select
                                key={this.state.config.lang}
                                defaultValue={this.state.config.lang}
                                style={{ width: 200 }}
                                onChange={this.handleLangChange.bind(this)}
                            >
                                {options}
                            </Select>
                        </Col>
                        <Col span={6}>
                            {intl.get("SystemConfig.tree.split")}
                        </Col>
                        <Col span={18}>
                            <Tooltip title="Will use the 'keys' command">
                                <Input
                                    style={{ width: 200 }}
                                    placeholder="Input Delimiter"
                                    defaultValue={this.state.config.splitSign}
                                    value={this.state.config.splitSign}
                                    onChange={this.handleSplitSignChange}
                                />{" "}
                            </Tooltip>
                            ,
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}
export default SystemConfig;
