export default class BufferUtils {
    /**
     * buffer是否可见
     *
     * @param {*} buffer
     * @returns boolean
     * @memberof BufferUtils
     */
    static bufferVisible(buffer) {
        return buffer.equals(Buffer.from(buffer.toString()));
    }
    /**
     * buffer 转为 string
     *
     * @static
     * @param {*} buffer
     * @returns String
     * @memberof BufferUtils
     */
    static bufferToString(buffer) {
        if (typeof buffer == "string") {
            return buffer;
        }
        if (this.bufferVisible(buffer)) {
            return buffer.toString();
        }
        return this.bufferToHex(buffer);
    }
    /**
     *二进制转为16hex
     *
     * @static
     * @param {*} buf
     * @returns
     * @memberof BufferUtils
     */
    static bufferToHex(buffer) {
        let result = [];
        for (let i = 0; i < buffer.length; i++) {
            let bufferItem = buffer[i];
            if (bufferItem >= 32 && bufferItem <= 126) {
                result.push(String.fromCharCode(bufferItem));
                continue;
            }
            result.push("\\x" + bufferItem.toString(16).padStart(2, 0));
        }
        return result.join("").toString();
    }
    /**
     *16hex 转为 buffer
     *
     * @static
     * @param {*} str
     * @returns
     * @memberof BufferUtils
     */
    static hexToBuffer(str) {
        try {
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
        } catch (error) {
            return str;
        }
    }
}
