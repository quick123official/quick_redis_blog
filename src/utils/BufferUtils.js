export default class BufferUtils {
    /**
     * buffer是否可见
     *
     * @param {*} buf
     * @returns
     * @memberof BufferUtils
     */
    static bufVisible(buf) {
        return buf.equals(Buffer.from(buf.toString()));
    }
    /**
     *buffer 转为 string
     *
     * @static
     * @param {*} buf
     * @returns
     * @memberof BufferUtils
     */
    static bufToString(buf) {
        if (typeof buf == "string") {
            return buf;
        }

        if (this.bufVisible(buf)) {
            return buf.toString();
        }

        return this.bufToHex(buf);
    }
    /**
     *转为hex
     *
     * @static
     * @param {*} buf
     * @returns
     * @memberof BufferUtils
     */
    static bufToHex(buf) {
        let result = buf.toJSON().data.map((item) => {
            if (item >= 32 && item <= 126) {
                return String.fromCharCode(item);
            }
            return "\\x" + item.toString(16);
        });

        return result.join("");
    }
    /**
     *str to buffer
     *
     * @static
     * @param {*} str
     * @returns
     * @memberof BufferUtils
     */
    static xToBuffer(str) {
        let result = "";

        for (var i = 0; i < str.length; ) {
            if (str.substr(i, 2) === "\\x") {
                result += str.substr(i + 2, 2);
                i += 4;
            } else {
                result += Buffer.from(str[i++]).toString("hex");
            }
        }

        return Buffer.from(result, "hex");
    }
    /**
     *裁剪string
     *
     * @static
     * @param {*} string
     * @param {number} [maxLength=20]
     * @returns
     * @memberof BufferUtils
     */
    static cutString(string, maxLength = 20) {
        if (string.length <= maxLength) {
            return string;
        }

        return string.substr(0, maxLength) + "...";
    }
    /**
     *判断是否json
     *
     * @static
     * @param {*} string
     * @returns
     * @memberof BufferUtils
     */
    static isJson(string) {
        try {
            let obj = JSON.parse(string);
            return !!obj && typeof obj === "object";
        } catch (e) {}

        return false;
    }
    /**
     *string to base64
     *
     * @static
     * @param {*} str
     * @returns
     * @memberof BufferUtils
     */
    static base64Encode(str) {
        return new Buffer(str, "utf8").toString("base64");
    }
    /**
     *base64 to buffer
     *
     * @static
     * @param {*} str
     * @returns
     * @memberof BufferUtils
     */
    static base64Decode(str) {
        return new Buffer(str, "base64").toString("utf8");
    }
}
