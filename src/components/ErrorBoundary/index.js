import React from "react";
import { message } from "antd";
import Log from "@/services/LogService";
/**
 *异常处理
 *
 * @class ErrorBoundary
 * @extends {React.Component}
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMsg: "" };
    }

    static getDerivedStateFromError(error) {
        // 显示错误到ui
        return { hasError: true, errorMsg: error };
    }

    componentDidCatch(error, errorInfo) {
        // 这里上报错误或者打印错误日志
        Log.error("[cmd=ErrorBoundary] componentDidCatch error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            message.error(
                "An exception occurs, please report to the official github" +
                    this.state.errorMsg
            );
            this.setState({ hasError: false, errorMsg: "" });
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
