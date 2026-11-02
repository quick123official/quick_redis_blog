const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
    })
);
module.exports = function override(config, env) {
    if (env === "production") {
        config.output.publicPath = "./";
    }
    return config;
};
/**
 * 使用@表示src目录的路径
 */
const path = require("path");
function resolve(dir) {
    return path.join(__dirname, ".", dir);
}
/**
 * add monaco-editor-webpack-plugin
 */
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
module.exports = function override(config, env) {
    config.resolve.alias = {
        "@": resolve("src"),
        // react-intl-universal 嵌套依赖的 intl-messageformat@11 使用了 class static block，
        // webpack 4 无法解析；统一指向根目录的 9.13.0（CJS，API 兼容 getAst）
        "intl-messageformat": resolve("node_modules/intl-messageformat"),
    };
    config.plugins.push(
        new MonacoWebpackPlugin({
            languages: ["json"],
        })
    );
    return config;
};