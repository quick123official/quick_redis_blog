var lodash = require("lodash");
test("lodash", () => {
    const arr = [
        {
            label: "All",
            value: "All",
        },
        {
            label: "All",
            value: "All",
        },
        {
            label: "Alex",
            value: "Ninja",
        },
        {
            label: "Bill",
            value: "Op",
        },
        {
            label: "Cill",
            value: "iopop",
        },
    ];
    lodash.uniqWith();
    let truncateResult = lodash.truncate(
        "GeeksforGeeks, is a computer science portal. GeeksforGeeks GeeksforGeeks GeeksforGeeks",
        {
            length: 22,
            omission: "***",
        }
    );
    expect(truncateResult).toBe("GeeksforGeeks, is a***");
});
