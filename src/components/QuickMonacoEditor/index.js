import MonacoEditor from "react-monaco-editor";
import { Row, Col, Button, Space, message } from "antd";
import React from "react";
import intl from "react-intl-universal";
const pako = require('pako');

/**
 * 扩展 MonacoEditor
 *
 * @class QuickMonacoEditor
 * @extends {MonacoEditor}
 */
class QuickMonacoEditor extends React.Component {
    // MonacoEditor Options
    MONACO_EDITOR_OPTIONS = {
        minimap: {
            enabled: false,
        },
        wordWrap: "on",
        fontSize: 14,
        scrollbar: {
            useShadows: true,
            vertical: "visible",
            horizontal: "visible",
            horizontalSliderSize: 20,
            verticalSliderSize: 20,
            horizontalScrollbarSize: 20,
            verticalScrollbarSize: 20,
        },
        autoIndent: false,
        autoClosingQuotes: true,
        autoClosingBrackets: true,
        autoClosingOvertype: true,
        colorDecorators: true,
        copyWithSyntaxHighlighting: true,
        cursorSmoothCaretAnimation: true,
        contextmenu: true,
        overviewRulerBorder: true,
        mouseWheelZoom: true,
        fontFamily: "Consolas, 'Courier New', monospace",
        roundedSelection: true,
        automaticLayout: true,
    };
    /**
     *组件更新
     *
     * @param {*} prevProps
     * @memberof QuickMonacoEditor
     */
    componentDidUpdate(prevProps) {
        this.refs.monacoEditor.editor.setSelection({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
        });
        this.refs.monacoEditor.editor.layout();
    }
    /**
     * 格式化 Json
     */
    formatJson() {
        try {
            let formattedStr = JSON.stringify(
                JSON.parse(this.props.value),
                null,
                4
            );
            this.props.onChange(formattedStr);
        } catch (error) {
            message.error("Json format error：" + error);
        }
    }
    /**
     *monacoEditor did mount
     *
     * @param {*} monacoEditor
     * @param {*} monaco
     * @memberof QuickMonacoEditor
     */
    editorDidMount(monacoEditor, monaco) {
        monacoEditor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
            () => {
                this.props.saveValue();
            }
        );
        monacoEditor.focus();
    }
    /**
     * 删除 Json 空格
     */
    delBlankJson() {
        try {
            let formattedStr = JSON.stringify(JSON.parse(this.props.value));
            this.props.onChange(formattedStr);
        } catch (error) {
            message.error("Json format error：" + error);
        }
    }

    /**
     * 解压gzip
     */
    ungzip() {
        try {
            let targetData = this.props.value;
            // 将base64编码的数据转换成原始的压缩数据
            const compressedData = new Uint8Array(atob(targetData).split('').map(char => char.charCodeAt()));
            console.log(compressedData);
            // 对压缩数据进行解压缩处理
            const data = pako.ungzip(compressedData, { to: 'string' });
            this.props.onChange(data);
        } catch (error) {
            message.error("Json format error：" + error);
        }
    }

    /**
     * 压缩gzip
     */
    gzip() {
        try {
            let oriData = this.props.value;
            const compressedData = pako.gzip(oriData);
            const base64Data = btoa(String.fromCharCode.apply(null, compressedData));
            this.props.onChange(base64Data);
        } catch (error) {
            message.error("Json format error：" + error);
        }

    }

    render() {
        return (
            <div>
                <Row>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Col span={24}>
                            <Space direction="horizontal">
                                <Button onClick={this.formatJson.bind(this)}>
                                    {intl.get("QuickMonacoEditor.format")}
                                </Button>
                                <Button onClick={this.delBlankJson.bind(this)}>
                                    {intl.get("QuickMonacoEditor.delformat")}
                                </Button>
                                <Button onClick={this.ungzip.bind(this)}>
                                    {intl.get("QuickMonacoEditor.ungzip")}
                                </Button>
                                <Button onClick={this.gzip.bind(this)}>
                                    {intl.get("QuickMonacoEditor.gzip")}
                                </Button>
                            </Space>
                        </Col>
                        <Col span={24}>
                            <div style={{ border: "1px solid #eee" }}>
                                <MonacoEditor
                                    ref="monacoEditor"
                                    height={this.props.height}
                                    language="json"
                                    theme="vs"
                                    value={this.props.value}
                                    defaultValue=""
                                    options={this.MONACO_EDITOR_OPTIONS}
                                    onChange={(value) => {
                                        this.props.onChange(value);
                                    }}
                                    editorDidMount={this.editorDidMount.bind(
                                        this
                                    )}
                                />
                            </div>
                        </Col>
                    </Space>
                </Row>
            </div>
        );
    }
}
export default QuickMonacoEditor;
