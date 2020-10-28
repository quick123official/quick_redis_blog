import React, { Component } from "react";
import "antd/dist/antd.css";
import ResourceTree from "@/pages/ResourceTree";
import SystemConfig from "@/components/SystemConfig";
import LocaleInit from "@/components/LocaleInit";
import HostTag from "@/pages/HostTag";
import SplitPane from "react-split-pane";
import HeartbeatService from "@/services/HeartbeatService";
import CheckUpdateService from "@/services/CheckUpdateService";
import "@/app/index.css";

class App extends Component {
    // left width = 300(minSize)+15(line)+
    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
        HeartbeatService.start();
        CheckUpdateService.start();
    }
    resize() {
        this.refs.hostTagDiv.style.width =
            window.innerWidth -
            this.refs.resourceTreeDiv.offsetWidth -
            30 +
            "px";
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }
    render() {
        return (
            <SplitPane
                split="vertical"
                minSize={200}
                maxSize={900}
                defaultSize={300}
                onDragStarted={() =>
                    (document.body.style.cursor = "col-resize")
                }
                onDragFinished={() => {
                    document.body.style.cursor = "auto";
                    this.resize();
                }}
            >
                <div
                    ref="resourceTreeDiv"
                    style={{
                        overflow: "auto",
                        height: "100vh",
                        background: "#fff",
                    }}
                >
                    <ResourceTree></ResourceTree>
                    <SystemConfig></SystemConfig>
                    <LocaleInit></LocaleInit>
                </div>
                <div ref="hostTagDiv">
                    <HostTag></HostTag>
                </div>
            </SplitPane>
        );
    }
}

export default App;
