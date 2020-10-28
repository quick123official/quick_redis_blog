/**
 * 版本号对比
 */
export default class VersionUtil {
    /**
     * 对比字符串版本号的大小，返回1则v1大于v2，返回-1则v1小于v2，返回0则v1等于v2
     *
     * @author github.com/xxcanghai
     * @param {string} v1 要进行比较的版本号1
     * @param {string} v2 要进行比较的版本号2
     * @returns
     */
    static versionCompare(v1, v2) {
        var GTR = 1; //大于
        var LSS = -1; //小于
        var EQU = 0; //等于
        var v1arr = String(v1)
            .split(".")
            .map(function (a) {
                return parseInt(a);
            });
        var v2arr = String(v2)
            .split(".")
            .map(function (a) {
                return parseInt(a);
            });
        var arrLen = Math.max(v1arr.length, v2arr.length);
        var result;

        //排除错误调用
        if (v1 === undefined || v2 === undefined) {
            throw new Error();
        }

        //检查空字符串，任何非空字符串都大于空字符串
        if (v1.length === 0 && v2.length === 0) {
            return EQU;
        } else if (v1.length === 0) {
            return LSS;
        } else if (v2.length === 0) {
            return GTR;
        }

        //循环比较版本号
        for (var i = 0; i < arrLen; i++) {
            result = xxcanghaiComp(v1arr[i], v2arr[i]);
            if (result === EQU) {
                continue;
            } else {
                break;
            }
        }
        return result;

        function xxcanghaiComp(n1, n2) {
            if (typeof n1 !== "number") {
                n1 = 0;
            }
            if (typeof n2 !== "number") {
                n2 = 0;
            }
            if (n1 > n2) {
                return GTR;
            } else if (n1 < n2) {
                return LSS;
            } else {
                return EQU;
            }
        }
    }
}
