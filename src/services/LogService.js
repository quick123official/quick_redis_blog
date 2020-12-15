const Log = window.require("electron-log");
const { remote } = window.require("electron");
let userDataDir = remote.app.getPath("userData");
Log.transports.file.file = userDataDir + "/logs/info.log";
export default Log;
