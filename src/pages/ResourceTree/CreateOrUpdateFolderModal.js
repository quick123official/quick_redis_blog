import React from "react";
import { Modal, Form, Input } from "antd";
import Log from "@/services/LogService";
import intl from "react-intl-universal";
/**
 * 创建或者修改目录名称
 *
 * @class CreateOrUpdateFolderModal
 * @extends {React.Component}
 */
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
class CreateOrUpdateFolderModal extends React.Component {
    /**
     * 在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
     *
     * @param {*} nextProps
     * @memberof HostKeyString
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        let form = this.refs.form;
        if (form === undefined) {
            return;
        }
        Object.keys(form.getFieldsValue()).forEach((key) => {
            const obj = {};
            obj[key] = this.props[key] || null;
            form.setFieldsValue(obj);
        });
    }
    render() {
        return (
            <Modal
                visible={this.props.visible}
                title={
                    this.props.type === 0
                        ? intl.get("ResourceTree.folder.create")
                        : intl.get("ResourceTree.folder.modify")
                }
                onCancel={() => {
                    let form = this.refs.form;
                    if (form === undefined) {
                        return;
                    }
                    form.resetFields();
                    this.props.handleCreateOrUpdateFolderModalCancel();
                }}
                onOk={() => {
                    let form = this.refs.form;
                    if (form === undefined) {
                        return;
                    }
                    form.validateFields()
                        .then((values) => {
                            this.props.handleCreateOrUpdateFolderModalOk(
                                values
                            );
                            form.resetFields();
                        })
                        .catch((e) => {
                            Log.error(
                                "CreateOrUpdateFolderModal validateFields error",
                                e
                            );
                        });
                }}
            >
                <Form
                    ref="form"
                    {...layout}
                    initialValues={{
                        folderName: this.props.folderName,
                    }}
                >
                    <Form.Item
                        name="folderName"
                        label={intl.get("ResourceTree.folder.name")}
                        rules={[
                            {
                                required: true,
                                message: intl.get(
                                    "ResourceTree.folder.name.rules"
                                ),
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}
export default CreateOrUpdateFolderModal;
