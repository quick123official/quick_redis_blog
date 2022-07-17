// 树的节点类型
// 0:新建连接;1:修改连接;2:删除连接;3:新建目录;4:修改目录;5:删除目录;6:删除;7:打开命令行;8:打开新窗口;9:断开连接;10:新建根目录;11:复制链接
export const HOSTS_TREEE_MENU_TYPE = {
    CREATE_CONN: 0,
    UPDATE_CONN: 1,
    DEL_CONN: 2,
    CREATE_FOLDER: 3,
    UPDATE_FOLDER: 4,
    DEL_FOLDER: 5,
    DEL_ALL: 6,
    CREATE_CONN_TERMINAL: 7,
    CREATE_CONN_MUTI: 8,
    DISCONNECT_CONN: 9,
    CREATE_FOLDER_ON_ROOT: 10,
    COPY_CONN: 11,
};
// redis value 数据类型
export const REDIS_DATA_TYPE = {
    STRING: "string",
    ZSET: "zset",
    SET: "set",
    HASH: "hash",
    LIST: "list",
};

// redis 数据显示组件使用
export const REDIS_DATA_SHOW = {
    // 批量获取数据的大小
    FETCH_DATA_SIZE: 5000,
    // 查询最大的条数
    MAX_SEARCH_DATA_SIZE: 10000,
    // 查询最大的条数-树型组件
    MAX_SEARCH_DATA_SIZE_TREE: 20000,
    // redis处理返回的成功的值
    REDIS_HANDLE_SUCCESS: 1,
    // redis处理返回的失败的值
    REDIS_HANDLE_FAIL: 0,
};

// 打开连接tab的类型
export const OPEN_TAB_TYPE = {
    // 打开新窗口（双击打开1个）
    CONN: 1,
    // 打开命令行
    CONN_TERMINAL: 2,
    // 打开新窗口（菜单打开多个）
    CONN_MUTI: 3,
    // 打开url
    URL: 4,
};
// 连接类型
export const CONNECT_TYPE = {
    // 直接连接
    DIRECT: "0",
    // SENTINEL
    SENTINEL: "1",
    // CLUSTER
    CLUSTER: "2",
};
// 全局配置管理
export const GLOBAL_CONFIG = {
    // host 文件
    HOSTS_FILE: "hosts_file.json",
    // 机器唯一标识
    IDENTIFIES_FILE: "identifies",
    // 系统配置文件
    SYSTEM_CONFIG_FILE: "system_config.json",
    // 搜索关键字存储的目录
    KEYS_HISTORY_FOLDER: "/keys_history/",
};
// Host tab remove type
export const HOST_TAB_REMOVE_TYPE = {
    // 关闭右侧
    RIGHT: "right",
    // 关闭左侧
    LEFT: "left",
    // 关闭其他
    OTHER: "other",
};
// 操作系统类型
export const OS_TYPE = {
    // mac
    DARWIN: "darwin",
    // win
    WIN32: "win32",
    // linux
    LINUX: "linux",
};
// redis key 展示的类型
export const HOST_KEY_SHOW_TYPE = {
    // 目录树
    TREE: "tree",
    // 单行表格
    TABLE: "table",
};
