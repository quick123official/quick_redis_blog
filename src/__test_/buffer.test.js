import { sortedUniq } from "lodash";
import BufferUtils from "./../utils/BufferUtils";
test("bufToHex", () => {
    let str1 = "quickredis快快";
    let buffer1 = Buffer.from(str1);
    // 1. 长度为16的可见字符
    let bufVisible1 = BufferUtils.bufferVisible(buffer1);
    expect(buffer1.length).toBe(16);
    expect(bufVisible1).toBe(true);
    expect(buffer1.toString()).toBe(str1);
    expect(BufferUtils.bufferToString(buffer1)).toBe(str1);
    // 2. 不可见字符
    let str2 = "\\xac\\xed:POST_USER_ID:4995_114351107008778";
    let buffer2 = BufferUtils.hexToBuffer(str2);
    let bufVisible2 = BufferUtils.bufferVisible(buffer2);
    expect(buffer2.length).toBe(36);
    expect(bufVisible2).toBe(false);
    expect(BufferUtils.bufferToString(buffer2)).toEqual(
        expect.not.stringMatching(str2)
    );
    // 3. hexToBuffer
    let hex3 = "\\xac\\xed\\x00\\x05t\\x00\\x1bspring.data.redis:111:22282";
    let buffer3 = BufferUtils.hexToBuffer(hex3);
    let hex3Orgi = BufferUtils.bufferToString(buffer3);
    expect(hex3Orgi).toBe(hex3);
});
