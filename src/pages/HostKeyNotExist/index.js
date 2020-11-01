import React, { Component } from "react";
import { Result } from "antd";
import intl from "react-intl-universal";
/**
 * HostKeyNotExist-keyType 不存在
 *
 * @class HostKeyList
 * @extends {Component}
 */
class HostKeyNotExist extends Component {
    state = { msg: "" };
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.setState({ msg: intl.get("HostKey.key.not.exist") });
    }
    render() {
        return (
            <div>
                <Result status="404" subTitle={this.state.msg} />
            </div>
        );
    }
}

export default HostKeyNotExist;
