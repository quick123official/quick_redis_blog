var lodash = require("lodash");
test("lodash", () => {
    var users = [
        { 'user': 'fred', 'age': 48 },
        { 'user': 'barney', 'age': 34 },
        { 'user': 'fred', 'age': 40 },
        { 'user': 'barney', 'age': 36 }
    ];
    // 以 `user` 升序排序 再  `age` 以降序排序。
    users = lodash.orderBy(users, ['user', 'age'], ['asc', 'desc']);
    console.log(users);
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
