import React, { Component } from "react";

/**
 * HostCornerMarker
 * 作者:修罗大人
 * 时间:2021-04-16 14:04:00
 * 描述: 自定义组件,实现角标提示
 * @class HostCornerMarker
 * @extends {Component}
 */
class HostCornerMarker extends Component {
    render() {
        return (
            <span>
                {this.props.title}({this.props.total})
            </span>
        );
    }
}

export default HostCornerMarker;
