const { app, dialog, ipcMain, nativeTheme } = require("electron");
module.exports = {
    init: (mainWindow) => {
        // 处理显示消息事件
        ipcMain.on("show-message", (event, arg) => {
            dialog.showMessageBox(mainWindow, {
                type: arg.type,
                title: arg.title,
                detail: arg.detail,
            });
        });
        // 处理获取操作系统事件
        ipcMain.on("get-platform", (event, arg) => {
            event.sender.send("get-platform-reply", process.platform);
        });

        // 处理获取当前主题事件
        ipcMain.on("get-current-theme", (event, arg) => {
            event.sender.send("current-theme-reply", {
                theme: nativeTheme.shouldUseDarkColors ? "dark" : "light",
                source: "system",
            });
        });

        // 处理设置主题事件（用户手动切换：light/dark/system）
        ipcMain.on("set-theme", (event, arg) => {
            const { theme } = arg;
            if (theme === "system") {
                nativeTheme.themeSource = "system";
            } else if (theme === "dark") {
                nativeTheme.themeSource = "dark";
            } else {
                nativeTheme.themeSource = "light";
            }
            // 更新窗口背景色
            mainWindow.setBackgroundColor(
                nativeTheme.shouldUseDarkColors ? "#141414" : "#EBEBEB"
            );
        });

        // 处理获取mac地址事件
        require("getmac").getMac(function (err, macAddress) {
            if (err || !macAddress) {
                macAddress = "default";
            }
            macAddress = macAddress.split(":").join("");
            ipcMain.on("get-host-url-params", (event, arg) => {
                let params =
                    "NextId=" + macAddress + "&version=" + app.getVersion();
                event.sender.send("get-host-url-params-reply-" + arg, params);
            });
        });
    },
};
