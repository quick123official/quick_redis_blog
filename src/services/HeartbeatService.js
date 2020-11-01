import uuid from "node-uuid";
let { ipcRenderer } = window.require("electron");
/**
 * 心跳服务
 */
export default class HeartbeatService {
    /**
     * 启动心跳检测
     */
    static start() {
        let startTime = new Date().valueOf();
        ipcRenderer.on(
            "get-host-url-params-reply-fetchHeartbeatUrl",
            (event, arg) => {
                let time = new Date().valueOf() - startTime;
                this.fetchHeartbeatUrl(arg, time);
            }
        );
        ipcRenderer.send("get-host-url-params", "fetchHeartbeatUrl");
        setInterval(() => {
            ipcRenderer.send("get-host-url-params", "fetchHeartbeatUrl");
        }, 60000);
    }
    /**
     * 发起心跳请求
     */
    static fetchHeartbeatUrl(arg, time) {
        let url =
            "https://redis.quick123.net/ping?from=QuickRedis&" +
            arg +
            "&r=" +
            uuid.v4() +
            "&time=" +
            time;
        fetch(url, {
            method: "GET",
            mode: "cors",
        })
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                return json;
            })
            .catch((err) => {
                console.log("request error", err);
            });
    }
}
