import MonacoEditor from "react-monaco-editor";
import { Row, Col, Button, Space, message } from "antd";
import React from "react";
import intl from "react-intl-universal";
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
                            </Space>
                        </Col>
                        <Col span={24}>
                            <div style={{ border: "1px solid #eee" }}>
                                <MonacoEditor
                                    ref="monacoEditor"
                                    height={this.props.height}
                                    language="javascript"
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
