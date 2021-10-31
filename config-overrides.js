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
    };
    config.plugins.push(
        new MonacoWebpackPlugin({
            languages: ["json"],
        })
    );
    return config;
};