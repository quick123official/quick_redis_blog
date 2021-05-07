const ElectronIntlUniversal = require("./ElectronIntlUniversal");
const { shell, app, dialog } = require("electron");
let Log = require("electron-log");
module.exports = {
    init: (mainWindow) => {
        ElectronIntlUniversal.init();
        let template = [
            {
                label: ElectronIntlUniversal.get("electron.menu.file"),
                submenu: [
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.file.import.connection"
                        ),
                        click: (item, focusedWindow) => {
                            dialog
                                .showOpenDialog(mainWindow, {
                                    properties: ["openFile"],
                                    filters: [
                                        {
                                            name: "json",
                                            extensions: ["json"],
                                        },
                                    ],
                                })
                                .then((result) => {
                                    if (!result.canceled) {
                                        mainWindow.webContents.send(
                                            "import-hosts-data",
                                            result.filePaths[0]
                                        );
                                    }
                                })
                                .catch((err) => {
                                    Log.error("[cmd=menu] 导入连接失败", err);
                                    dialog.showMessageBox(mainWindow, {
                                        type: "info",
                                        title: "提示",
                                        detail: "导入连接失败",
                                    });
                                });
                        },
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.file.export.connection"
                        ),
                        click: (item, focusedWindow) => {
                            dialog
                                .showSaveDialog(mainWindow, {
                                    title: "导出连接",
                                    filters: [
                                        {
                                            name: "json",
                                            extensions: ["json"],
                                        },
                                    ],
                                })
                                .then((result) => {
                                    if (!result.canceled) {
                                        mainWindow.webContents.send(
                                            "export-hosts-data",
                                            result.filePath
                                        );
                                    }
                                })
                                .catch((err) => {
                                    Log.error("[cmd=menu] 导出连接失败", err);
                                    dialog.showMessageBox(mainWindow, {
                                        type: "info",
                                        title: "提示",
                                        detail: "导入连接失败",
                                    });
                                });
                        },
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.file.reset.connection"
                        ),
                        click: (item, focusedWindow) => {
                            mainWindow.webContents.send("clean-hosts-data", "");
                        },
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.file.system.Configuration"
                        ),
                        click: (item, focusedWindow) => {
                            mainWindow.webContents.send("system-config", "");
                        },
                    },
                    {
                        type: "separator",
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.file.exit"
                        ),
                        click: (item, focusedWindow) => {
                            app.quit();
                        },
                    },
                ],
            },
            {
                label: ElectronIntlUniversal.get("electron.menu.edit"),
                submenu: [
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.edit.undo"
                        ),
                        accelerator: "CmdOrCtrl+Z",
                        role: "undo",
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.edit.redo"
                        ),
                        accelerator: "Shift+CmdOrCtrl+Z",
                        role: "redo",
                    },
                    {
                        type: "separator",
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.edit.cut"
                        ),
                        accelerator: "CmdOrCtrl+X",
                        role: "cut",
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.edit.copy"
                        ),
                        accelerator: "CmdOrCtrl+C",
                        role: "copy",
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.edit.paste"
                        ),
                        accelerator: "CmdOrCtrl+V",
                        role: "paste",
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.edit.select.all"
                        ),
                        accelerator: "CmdOrCtrl+A",
                        role: "selectall",
                    },
                ],
            },
            {
                label: ElectronIntlUniversal.get("electron.menu.view"),
                submenu: [
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.view.reload"
                        ),
                        accelerator: "CmdOrCtrl+R",
                        click: (item, focusedWindow) => {
                            if (focusedWindow) {
                                focusedWindow.reload();
                            }
                        },
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.view.toggle.full.screen"
                        ),
                        accelerator: (() => {
                            if (process.platform === "darwin") {
                                return "Ctrl+Command+F";
                            } else {
                                return "F11";
                            }
                        })(),
                        click: (item, focusedWindow) => {
                            if (focusedWindow) {
                                focusedWindow.setFullScreen(
                                    !focusedWindow.isFullScreen()
                                );
                            }
                        },
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.view.switch.dev.tools"
                        ),
                        accelerator: (() => {
                            if (process.platform === "darwin") {
                                return "Alt+Command+I";
                            } else {
                                return "Ctrl+Shift+I";
                            }
                        })(),
                        click: (item, focusedWindow) => {
                            if (focusedWindow) {
                                focusedWindow.toggleDevTools();
                            }
                        },
                    },
                ],
            },
            {
                label: ElectronIntlUniversal.get("electron.menu.window"),
                role: "window",
                submenu: [
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.window.minimize"
                        ),
                        accelerator: "CmdOrCtrl+M",
                        role: "minimize",
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.window.close"
                        ),
                        accelerator: "CmdOrCtrl+W",
                        role: "close",
                    },
                    {
                        type: "separator",
                    },
                ],
            },
            {
                label: ElectronIntlUniversal.get("electron.menu.help"),
                role: "help",
                submenu: [
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.help.submit.issues.github"
                        ),
                        click: () => {
                            shell.openExternal(
                                "https://github.com/quick123official/quick_redis_blog"
                            );
                        },
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.help.submit.issues.gitee"
                        ),
                        click: () => {
                            shell.openExternal(
                                "https://gitee.com/quick123official/quick_redis_blog"
                            );
                        },
                    },
                    {
                        type: "separator",
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.help.officail.website"
                        ),
                        click: () => {
                            shell.openExternal("https://quick123.net/");
                        },
                    },
                    {
                        label: ElectronIntlUniversal.get(
                            "electron.menu.help.about"
                        ),
                        click: () => {
                            dialog.showMessageBox(mainWindow, {
                                type: "info",
                                title: ElectronIntlUniversal.get(
                                    "electron.menu.help.about"
                                ),
                                detail: `Copyright © 2020 https://quick123.net/\nVersion: ${app.getVersion()}`,
                            });
                        },
                    },
                ],
            },
        ];
        if (process.platform === "darwin") {
            const name = app.name;
            template.unshift({
                label: name,
                submenu: [
                    {
                        label: `关于 QuickRedis`,
                        role: "about",
                    },
                    {
                        type: "separator",
                    },
                    {
                        label: "服务",
                        role: "services",
                        submenu: [],
                    },
                    {
                        type: "separator",
                    },
                    {
                        label: `隐藏 ${name}`,
                        accelerator: "Command+H",
                        role: "hide",
                    },
                    {
                        label: "隐藏其它",
                        accelerator: "Command+Alt+H",
                        role: "hideothers",
                    },
                    {
                        label: "显示全部",
                        role: "unhide",
                    },
                    {
                        type: "separator",
                    },
                    {
                        label: "退出",
                        accelerator: "Command+Q",
                        click: () => {
                            app.quit();
                        },
                    },
                ],
            });
        }
        return template;
    },
};
