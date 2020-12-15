import Log from "@/services/LogService";
import VersionUtil from "@/utils/VersionUtil";
import uuid from "node-uuid";
import { notification } from "antd";
import intl from "react-intl-universal";
let { ipcRenderer } = window.require("electron");
let fs = window.require("fs");
let { remote } = window.require("electron");
let userDataPath = remote.app.getPath("userData");

/**
 * 检查更新服务
 */
export default class CheckUpdateService {
    // 是否检查中
    static checkSign = false;

    // 操作系统类型
    static osType = false;
    /**
     * 启动检测
     */
    static start() {
        // 处理显示消息事件
        ipcRenderer.on("get-platform-reply", (event, arg) => {
            this.osType = arg;
            this.check();
        });
        setTimeout(() => {
            ipcRenderer.send("get-platform", "");
        }, 1);
    }
    /**
     * 开始检查
     */
    static check() {
        // 0. 是否检查中
        if (this.checkSign === true) {
            return;
        }
        this.checkSign = true;
        try {
            // 1. 创建文件夹
            let dirPath = userDataPath + "/download/";
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
                Log.info(
                    "[cmd=CheckUpdateService.check] folder create success. dirPath > ",
                    dirPath
                );
            }
            // 2. 下载 latest.json
            let latestFileUrl =
                "https://quick123.net/files/redis/latest.json?r=" + uuid.v4();
            fetch(latestFileUrl, {
                method: "GET",
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    let currentVersion = remote.app.getVersion();
                    let latestVersion = data.latestVersion;
                    // let osType = this.osType;
                    // // 检查os和版本
                    // Log.info(
                    //     "检查os和版本",
                    //     currentVersion,
                    //     latestVersion,
                    //     osType
                    // );
                    let result = VersionUtil.versionCompare(
                        currentVersion,
                        latestVersion
                    );
                    if (result === -1) {
                        notification.info({
                            message: intl.get(
                                "CheckUpdateService.notification.message"
                            ),
                            description: intl.get(
                                "CheckUpdateService.notification.description",
                                {
                                    currentVersion: currentVersion,
                                    latestVersion: latestVersion,
                                }
                            ),
                            placememt: "topRight",
                            duration: null,
                        });
                    }
                    return data;
                })
                .catch((err) => {
                    Log.error("[cmd=CheckUpdateService.fetch] error. ", err);
                });
        } catch (error) {
            Log.error("[cmd=CheckUpdateService.check] check error. ", error);
        }
        this.checkSign = false;
    }
}
