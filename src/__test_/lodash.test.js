test("lodash", () => {
    let dbIndexMap = new Map();
    dbIndexMap.set(1, {
        key: "" + 1,
        dbIndex: 1,
        title: 1,
        total: 0,
    });
    dbIndexMap.set(20, {
        key: "" + 1,
        dbIndex: 20,
        title: 1,
        total: 0,
    });
    for ([key, value] of dbIndexMap) {
        if (value.dbIndex >= 16) {
            console.info("", key, value);
        }
    }
});
