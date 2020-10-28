/**
 * 常用工具
 */
export default class CommonUtils {
    /**
     *获取字符串的hash值
     *
     * @param {*} str
     * @returns
     * @memberof CommonUtils
     */
    hashCode(str) {
        return str
            .split("")
            .reduce(
                (prevHash, currVal) =>
                    ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
                0
            );
    }
}
