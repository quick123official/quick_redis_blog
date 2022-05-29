import Log from "@/services/LogService";
import { GLOBAL_CONFIG } from "@/utils/constant";
let fs = window.require("fs");
let CircularJSON = window.require("circular-json");
/**
 *host 文件读写
 *
 * @export
 * @class HostsFileService
 */
export default class HostsFileService {
    /**
     * 获取 hosts 文件路径
     * @static
     * @returns
     * @memberof HostsFileService
     */
    static getHostsFilePath() {
        let { remote } = window.require("electron");
        let userDataPath = remote.app.getPath("userData");
        let hostsFilePath = userDataPath + "/" + GLOBAL_CONFIG.HOSTS_FILE;
        return hostsFilePath;
    }

    /**
     * 从默认路径的文件获取host数据
     *
     * @static
     * @returns
     * @memberof HostsFileService
     */
    static getHostsData() {
        let hostsFilePath = this.getHostsFilePath();
        var data = undefined;
        try {
            data = fs.readFileSync(hostsFilePath, "utf-8");
        } catch (e) {
            Log.error(
                "[cmd=HostsFileService] getHostsData error",
                hostsFilePath,
                e
            );
        }
        if (data === undefined || data === "") {
            // [] 表示删除的，"" 表示删除的。删除的清空则不给默认值
            data =
                '[{"title":"This is a directory","name":"This is a directory","isLeaf":false,"children":[{"title":"subdirectory","name":"Subdirectory","isLeaf":false,"children":[]}]},{"title":"cluster-[127.0.0.1:6379]","name":"cluster","isLeaf":true,"data":{"host":"127.0.0.1","port":6379,"auth":"123456","connectType":"2","masterName":null,"sentinelPassword":null}},{"title":"Direct-[127.0.0.1:6379]","name":"Direct","isLeaf":true,"data":{"host":"127.0.0.1","port":6379,"auth":"123456","connectType":"0","masterName":null,"sentinelPassword":null}},{"title":"Sentinel-[127.0.0.1:16379]","name":"Sentinel","isLeaf":true,"data":{"host":"127.0.0.1","port":16379,"auth":"123456","connectType":"1","masterName":"MyMasterName","sentinelPassword":null}}]';
        }
        return data;
    }

    /**
     * 把node保存到默认路径的文件
     *
     * @static
     * @param {*} node
     * @memberof HostsFileService
     */
    static saveHostsDataByNode(node) {
        this.sortNode(node);
        let hostsFilePath = this.getHostsFilePath();
        // let deepCopyNode = JSON.parse(JSON.stringify(node));
        let deepCopyNode = JSON.parse(CircularJSON.stringify(node));
        this.cleanNode(deepCopyNode);
        let jsonHostsData = JSON.stringify(deepCopyNode, null, "\t");
        try {
            fs.writeFileSync(hostsFilePath, jsonHostsData, "utf-8");
        } catch (e) {
            Log.error(
                "[cmd=HostsFileService] saveHostsDataByNode error",
                hostsFilePath,
                e
            );
        }
    }
    static compare(p) {
        return function (m, n) {
            var a = m[p];
            var b = n[p];
            return a - b; //升序
        };
    }
    /**
     *node排序
     *
     * @static
     * @param {*} children
     * @memberof HostsFileService
     */
    static sortNode(children) {
        children.sort(function (m, n) {
            if ((m.isLeaf && n.isLeaf) || (!m.isLeaf && !n.isLeaf)) {
                // 都是叶子或者目录，则按照a-z排序
                var a = m.name;
                var b = n.name;
                return a.localeCompare(b);
            } else if (m.isLeaf) {
                // m是叶子，n不是叶子
                return 1;
            } else if (n.isLeaf) {
                // m不是叶子，n是叶子
                return -1;
            } else {
                return -1;
            }
        });
        for (let i = 0; i < children.length; i++) {
            let c = children[i];
            if (!c.isLeaf) {
                this.sortNode(c.children);
            }
        }
    }
    /**
     * 导入hosts文件
     *
     * @static
     * @param {*} importHostsFilePath
     * @memberof HostsFileService
     */
    static importHostsDataByHostFilePath(importHostsFilePath) {
        var data = undefined;
        try {
            data = fs.readFileSync(importHostsFilePath, "utf-8");
        } catch (e) {
            Log.error(
                "[cmd=HostsFileService] saveHostsDataByHostFilePath error",
                importHostsFilePath,
                e
            );
            return false;
        }
        if (!data) {
            Log.error(
                "[cmd=HostsFileService] saveHostsDataByHostFilePath error. !data. data > {}",
                data
            );
            return false;
        }
        let deepCopyNode = JSON.parse(data);
        if (!Array.isArray(deepCopyNode)) {
            Log.error(
                "[cmd=HostsFileService] saveHostsDataByHostFilePath error. !Array.isArray(deepCopyNode). data > {}",
                data
            );
            return false;
        }
        this.cleanNode(deepCopyNode);
        let jsonHostsData = JSON.stringify(deepCopyNode);
        let hostsFilePath = this.getHostsFilePath();
        try {
            fs.writeFileSync(hostsFilePath, jsonHostsData, "utf-8");
            return true;
        } catch (e) {
            Log.error(
                "[cmd=HostsFileService] saveHostsDataByHostFilePath error",
                hostsFilePath,
                e
            );
            return false;
        }
    }
    /**
     * 导出连接
     * @param {*} hostsFilePath
     */
    static exportHostsDataToHostFilePath(exportHostsFilePath) {
        let hostData = this.getHostsData();
        try {
            fs.writeFileSync(exportHostsFilePath, hostData, "utf-8");
            return true;
        } catch (e) {
            Log.error(
                "[cmd=HostsFileService] exportHostsDataToHostFilePath error",
                exportHostsFilePath,
                e
            );
            return false;
        }
    }
    /**
     *重置连接数据
     *
     * @static
     * @returns
     * @memberof HostsFileService
     */
    static cleanHostsData() {
        let hostsFilePath = this.getHostsFilePath();
        let jsonHostsData = "";
        try {
            fs.writeFileSync(hostsFilePath, jsonHostsData, "utf-8");
            return true;
        } catch (e) {
            Log.error(
                "[cmd=HostsFileService] cleanHostsData error",
                hostsFilePath,
                e
            );
            return false;
        }
    }
    /**
     *递归清空node的一些属性
     *
     * @static
     * @param {*} children
     * @param {*} node
     * @memberof HostsFileService
     */
    static cleanNode(children) {
        for (let i = 0; i < children.length; i++) {
            let c = children[i];
            let tmpNode = (({ title, name, isLeaf, data, children }) => ({
                title,
                name,
                isLeaf,
                data,
                children,
            }))(c);
            children[i] = tmpNode;
            if (!c.isLeaf) {
                this.cleanNode(c.children);
            }
        }
    }
}
