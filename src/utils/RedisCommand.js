import Log from "@/services/LogService";
import splitargs from "redis-splitargs";
/**
 * redis 命令行工具
 */
export default class RedisCommand {
    /**
     *解释结果
     *
     * @static
     * @param {*} command
     * @param {*} result
     * @returns
     * @memberof RedisCommand
     */
    static parseResult(command, result) {
        let append = "";
        if (result === null) {
            append = `${null}\n`;
        } else if (command === "scan") {
            append += `1) ` + result[0] + `\n`;
            for (const i in result[1]) {
                append += `2) ` + i + ") " + result[1][i] + `\n`;
            }
        } else if (typeof result === "object") {
            const isArray = !isNaN(result.length);
            for (const i in result) {
                if (typeof result[i] === "object" && result[i] !== null) {
                    if (result[i][0] === null) {
                        append += this.parseResult("", result[i][1]);
                    } else {
                        append += this.parseResult("", result[i]);
                    }
                } else {
                    append += `${(isArray ? "" : `${i}\n`) + result[i]}\n`;
                }
            }
        } else {
            append = `${result}\n`;
        }
        return append;
    }
    /**
     *调用命令
     *
     * @static
     * @param {*} redis
     * @param {*} print
     * @param {*} args
     * @memberof RedisCommand
     */
    static invoke(redis, print, args) {
        let commandLine = args.join(" ");
        let splitCommandLine = splitargs(commandLine);
        try {
            let promise = redis[splitCommandLine[0]](
                ...splitCommandLine.slice(1)
            );
            promise
                .then((reply) => {
                    let content = this.parseResult(splitCommandLine[0], reply);
                    print(content);
                })
                .catch((e1) => {
                    print("" + e1);
                    Log.error("[cmd=RedisCommand] invoke error e1", e1);
                });
        } catch (e2) {
            print("" + e2);
            Log.error("[cmd=RedisCommand] invoke error e2", e2);
        }
    }
}
