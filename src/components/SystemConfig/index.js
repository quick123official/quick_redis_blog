import React from "react";
import { Modal, Row, Col, Select, Input, Tooltip, Checkbox } from "antd";
import LocaleUtils from "@/utils/LocaleUtils";
import intl from "react-intl-universal";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useTheme, THEME_MODE } from "@/theme/ThemeContext";
const { Option } = Select;
const { confirm } = Modal;
const { ipcRenderer, remote } = window.require("electron");
/**
 * 系统配置（包装组件，处理主题）
 */
function SystemConfigWithTheme() {
    const theme = useTheme();
    return <SystemConfig themeContext={theme} />;
}

/**
 * 系统配置
 */
class SystemConfig extends React.Component {
    needRestart = false;
    state = {
        visible: false,
        config: { lang: "", splitSign: "", autoFormatJson: true, theme: "system" },
    };

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

        // 应用主题设置
        if (this.props.themeContext) {
            this.props.themeContext.setTheme(this.state.config.theme || "system");
        }

        if (this.needRestart) {
            this.needRestart = false;
            confirm({
                title: intl.get("common.notice"),
                icon: <ExclamationCircleOutlined />,
                content: intl.get("SystemConfig.needRestart"),
                onOk() {
                    remote.app.quit();
                },
                onCancel() {},
            });
        }
    };

    handleCancel = (e) => {
        this.needRestart = false;
        this.setState({
            visible: false,
        });
    };

    /**
     *修改语言
     */
    handleLangChange(val) {
        this.setState({
            config: { ...this.state.config, lang: val },
        });
        this.needRestart = true;
    }

    /**
     *修改分隔符
     */
    handleSplitSignChange = (event) => {
        this.setState({
            config: { ...this.state.config, splitSign: event.target.value },
        });
        this.needRestart = true;
    };

    /**
     *修改自动格式化json
     */
    handleAutoFormatJsonChange = (event) => {
        this.setState({
            config: {
                ...this.state.config,
                autoFormatJson: event.target.checked,
            },
        });
    };

    /**
     *修改主题
     */
    handleThemeChange = (val) => {
        this.setState({
            config: { ...this.state.config, theme: val },
        });
        // 主题切换不需要重启，立即生效
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
                                style={{ width: 300 }}
                                onChange={this.handleLangChange.bind(this)}
                            >
                                {options}
                            </Select>
                        </Col>
                        <Col span={6}>
                            {intl.get("SystemConfig.tree.split")}
                        </Col>
                        <Col span={18}>
                            <Tooltip title="When you set this value, the keys will be displayed in the form of a directory.">
                                <Input
                                    style={{ width: 300 }}
                                    placeholder="Input Delimiter"
                                    defaultValue={this.state.config.splitSign}
                                    value={this.state.config.splitSign}
                                    onChange={this.handleSplitSignChange}
                                />
                            </Tooltip>
                        </Col>
                        <Col span={6}>
                            {intl.get("SystemConfig.auto.format.json")}
                        </Col>
                        <Col span={18}>
                            <Checkbox
                                onChange={this.handleAutoFormatJsonChange}
                                checked={this.state.config.autoFormatJson}
                            ></Checkbox>
                        </Col>
                        <Col span={6}>
                            {intl.get("SystemConfig.theme")}
                        </Col>
                        <Col span={18}>
                            <Select
                                value={this.state.config.theme || "system"}
                                style={{ width: 300 }}
                                onChange={this.handleThemeChange}
                            >
                                <Option value="system">
                                    {intl.get("SystemConfig.theme.system")}
                                </Option>
                                <Option value="light">
                                    {intl.get("SystemConfig.theme.light")}
                                </Option>
                                <Option value="dark">
                                    {intl.get("SystemConfig.theme.dark")}
                                </Option>
                            </Select>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}
export default SystemConfigWithTheme;
