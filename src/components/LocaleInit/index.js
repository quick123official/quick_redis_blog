import React from "react";
import LocaleUtils from "@/utils/LocaleUtils";
import intl from "react-intl-universal";
require("intl/locale-data/jsonp/en.js");
require("intl/locale-data/jsonp/zh.js");
require("intl/locale-data/jsonp/fr.js");
require("intl/locale-data/jsonp/ja.js");
/**
 * 系统配置
 */
class LocaleInit extends React.Component {
    constructor(props) {
        super(props);
        // 导入语言配置文件
        let currentLocale = LocaleUtils.readSystemConfig().lang;
        intl.init({
            currentLocale,
            locales: {
                [currentLocale]: require("./../../../public/locales/" +
                    currentLocale),
            },
        });
    }
    render() {
        return <div></div>;
    }
}

export default LocaleInit;
