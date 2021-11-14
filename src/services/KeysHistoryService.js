import { GLOBAL_CONFIG } from "@/utils/constant";
import Log from "@/services/LogService";
let fs = window.require("fs");
var lodash = window.require("lodash");
/**
 * 搜索关键字管理
 *
 * @export
 * @class KeysHistoryService
 */
export default class KeysHistoryService {
    // KeysHistory = [
    //         { key: "11", frequency: 1 },
    //         { key: "22", frequency: 2 },
    //     ];
    /**
     *保存 ip + ":" + port + ".json" 和 keysHistoryList 的关系
     *
     * @memberof KeysHistoryService
     */
    static keysHistoryListMap = new Map();
    /**
     *获取文件路径
     *
     * @static
     * @memberof KeysHistoryService
     */
    static getFilePath(fileName) {
        let { remote } = window.require("electron");
        let userDataPath = remote.app.getPath("userData");
        let folderPath = userDataPath + "/" + GLOBAL_CONFIG.KEYS_HISTORY_FOLDER;
        let filePath = folderPath + fileName;
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(folderPath, { recursive: true }, (err) => {
                Log.error("[cmd=getFilePath] mkdirSync error", err);
            });
            fs.writeFileSync(filePath, "[]", "utf8");
        }
        return filePath;
    }
    /**
     *根据ip和端口获取 keysHistoryList
     *
     * @static
     * @param {*} ip
     * @param {*} port
     * @returns
     * @memberof KeysHistoryService
     */
    static getKeysHistoryList(fileName) {
        let filePath = this.getFilePath(fileName);
        let strData = fs.readFileSync(filePath, "utf8");
        let keysHistoryList = JSON.parse(strData);
        return keysHistoryList;
    }

    /**
     *根据ip和端口获取数据
     *
     * @static
     * @param {*} ip
     * @param {*} port
     * @returns
     * @memberof KeysHistoryService
     */
    static getData(ip, port) {
        let fileName = ip + ":" + port + ".json";
        let keysHistoryList = this.keysHistoryListMap.get(fileName);
        if (keysHistoryList !== undefined) {
            return keysHistoryList;
        }
        keysHistoryList = this.getKeysHistoryList(fileName);
        this.keysHistoryListMap.set(fileName, keysHistoryList);
        return keysHistoryList;
    }

    /**
     *添加key
     *
     * @static
     * @param {*} ip
     * @param {*} port
     * @param {*} key
     * @memberof KeysHistoryService
     */
    static addKeysHistory(ip, port, key) {
        if (key === undefined || key === "") {
            return;
        }
        key = lodash.trim(key);
        if (key === "" || key.length < 3) {
            return;
        }
        let keysHistoryList = this.getData(ip, port);
        let keysHistory = lodash.find(keysHistoryList, function (o) {
            return o.key === key;
        });
        // 修改词频
        if (keysHistory === undefined) {
            keysHistoryList.push({ key: key, frequency: 1 });
        } else {
            keysHistory.frequency = keysHistory.frequency + 1;
        }
        // 词频降序排序。
        keysHistoryList = lodash.orderBy(
            keysHistoryList,
            ["frequency"],
            ["desc"]
        );
        let fileName = ip + ":" + port + ".json";
        this.keysHistoryListMap.set(fileName, keysHistoryList);
        let filePath = this.getFilePath(fileName);
        let strData = JSON.stringify(keysHistoryList);
        fs.writeFileSync(filePath, strData, "utf8");
    }
    /**
     *搜索key
     *
     * @static
     * @param {*} ip
     * @param {*} port
     * @param {*} key
     * @memberof KeysHistoryService
     */
    static searchKey(ip, port, key) {
        let maxLength = 10;
        let keyHistoryArr = [];
        let keysHistoryList = KeysHistoryService.getData(ip, port);
        lodash(keysHistoryList).forEach(function (value) {
            if (value.key.indexOf(key) !== -1) {
                keyHistoryArr.push({ value: value.key });
            }
            if (keyHistoryArr.length > maxLength) {
                return false;
            }
        });
        return keyHistoryArr;
    }
}
