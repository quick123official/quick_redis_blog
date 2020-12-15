const { app, dialog, ipcMain } = require("electron");
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
