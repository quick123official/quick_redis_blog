import React, { Component, useEffect } from "react";
import ResourceTree from "@/pages/ResourceTree";
import SystemConfig from "@/components/SystemConfig";
import LocaleInit from "@/components/LocaleInit";
import HostTag from "@/pages/HostTag";
import SplitPane from "react-split-pane";
import HeartbeatService from "@/services/HeartbeatService";
import CheckUpdateService from "@/services/CheckUpdateService";
import { useTheme } from "@/theme/ThemeContext";
import "@/app/index.css";

/**
 * 根据主题加载对应的 antd CSS
 * 使用 CDN 加载，避免依赖本地文件路径
 */
function loadAntdTheme(actualTheme) {
    // 移除已有的 antd 样式
    document.querySelectorAll('link[antd-theme="true"]').forEach((link) => {
        link.remove();
    });

    // 使用 unpkg CDN 加载 antd CSS
    // antd 4.2.4 提供了 antd.dark.css 暗色主题
    const cssPath = actualTheme === "dark"
        ? "https://unpkg.com/antd@4.2.4/dist/antd.dark.css"
        : "https://unpkg.com/antd@4.2.4/dist/antd.css";

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssPath;
    link.setAttribute("antd-theme", "true");
    link.setAttribute("crossorigin", "anonymous");
    document.head.appendChild(link);
}

class App extends Component {
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
                        background: "var(--app-bg-secondary)",
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

/**
 * 包装 App，注入主题相关的副作用
 */
function AppWithTheme() {
    const { actualTheme, isDark } = useTheme();

    // 加载 antd 主题 CSS
    useEffect(() => {
        loadAntdTheme(actualTheme);
    }, [actualTheme]);

    // 在 body 上设置主题 class + CSS 变量
    useEffect(() => {
        if (isDark) {
            document.body.classList.add("theme-dark");
            document.body.classList.remove("theme-light");
            // 设置 CSS 变量（暗色主题）
            document.documentElement.style.setProperty("--app-bg-primary", "#141414");
            document.documentElement.style.setProperty("--app-bg-secondary", "#1f1f1f");
            document.documentElement.style.setProperty("--app-bg-tertiary", "#262626");
            document.documentElement.style.setProperty("--app-text-primary", "rgba(255,255,255,0.85)");
            document.documentElement.style.setProperty("--app-text-secondary", "rgba(255,255,255,0.65)");
            document.documentElement.style.setProperty("--app-border-color", "#424242");
            document.documentElement.style.setProperty("--app-divider-color", "#303030");
            document.documentElement.style.setProperty("--app-split-pane-bg", "#595959");
        } else {
            document.body.classList.add("theme-light");
            document.body.classList.remove("theme-dark");
            // 设置 CSS 变量（浅色主题）
            document.documentElement.style.setProperty("--app-bg-primary", "#ffffff");
            document.documentElement.style.setProperty("--app-bg-secondary", "#fafafa");
            document.documentElement.style.setProperty("--app-bg-tertiary", "#f0f0f0");
            document.documentElement.style.setProperty("--app-text-primary", "rgba(0,0,0,0.85)");
            document.documentElement.style.setProperty("--app-text-secondary", "rgba(0,0,0,0.65)");
            document.documentElement.style.setProperty("--app-border-color", "#d9d9d9");
            document.documentElement.style.setProperty("--app-divider-color", "#f0f0f0");
            document.documentElement.style.setProperty("--app-split-pane-bg", "#000");
        }
    }, [isDark]);

    return <App />;
}

export default AppWithTheme;
