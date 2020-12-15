import React, { Component } from "react";
import uuid from "node-uuid";
const { ipcRenderer } = window.require("electron");
/**
 * 打开页面
 *
 * @class HostUrl
 * @extends {Component}
 */
class HostUrl extends Component {
    state = { url: "", hostUrlIframeKey: uuid.v4() };

    componentDidMount() {
        setTimeout(
            function () {
                ipcRenderer.on(
                    "get-host-url-params-reply-HostUrl",
                    (event, arg) => {
                        this.setState({
                            url:
                                "https://redis.quick123.net/?from=QuickRedis&" +
                                arg +
                                "&r=" +
                                uuid.v4(),
                            hostUrlIframeKey: uuid.v4(),
                        });
                    }
                );
                ipcRenderer.send("get-host-url-params", "HostUrl");
            }.bind(this),
            2000
        );
    }

    render() {
        return (
            <div style={{ paddingLeft: "50px" }}>
                <iframe
                    key={this.state.hostUrlIframeKey}
                    title="hostUrlIframe"
                    style={{
                        width: "100%",
                        height: "90vh",
                        overflow: "visible",
                    }}
                    src={this.state.url}
                    scrolling="no"
                    frameBorder="0"
                />
            </div>
        );
    }
}

export default HostUrl;
