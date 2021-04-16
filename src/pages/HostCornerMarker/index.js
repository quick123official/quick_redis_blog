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
            <div>
                {this.props.title}
                {this.props.total > 0 &&
                    <>
                        <div
                            style={{ width: '5px', display: 'inline-block' }}
                        ></div>
                        <div
                            style={
                                { background: '#8fc63d', width: '10px', height: '10px', borderRadius: '5px', float: 'right' }
                            }
                        >
                        </div>
                    </>
                }
            </div>
        );
    }
}

export default HostCornerMarker;
