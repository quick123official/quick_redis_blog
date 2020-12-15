let Log = require("electron-log");
const { app } = require("electron");
let fs = require("fs");
let path = require("path");
let lodash = require("lodash");
/**
 * electron 多语言
 */

const ElectronIntlUniversal = {
    langData: {},
    /**
     * 初始化
     */
    init: () => {
        // 导入语言配置文件
        let currentLocale = ElectronIntlUniversal.readSystemConfig().lang;
        let langPath = path.join(
            __dirname,
            "./../locales/" + currentLocale + ".json"
        );
        let langJsonData = undefined;
        try {
            langJsonData = fs.readFileSync(langPath, "utf-8");
        } catch (e) {
            Log.error("[cmd=ElectronIntlUniversal.init] error", langPath, e);
        }
        ElectronIntlUniversal.langData = JSON.parse(langJsonData);
    },
    get: (key) => {
        let result = lodash.get(ElectronIntlUniversal.langData, key);
        if (result === null) {
            return key;
        } else {
            return result;
        }
    },
    LOCALES: [
        {
            label: "English",
            value: "en",
        },
        {
            label: "简体中文",
            value: "zh-CN",
        },
        {
            label: "繁體中文",
            value: "zh-TW",
        },
        {
            label: "Español",
            value: "es",
        },
        {
            label: "Português",
            value: "pt",
        },
        {
            label: "русский",
            value: "ru",
        },
        {
            label: "日本語",
            value: "ja",
        },
        {
            label: "Deutsche",
            value: "de",
        },
        {
            label: "français",
            value: "fr",
        },
        {
            label: "한국어",
            value: "ko",
        },
        {
            label: "Tiếng Việt",
            value: "vi",
        },
        {
            label: "čeština",
            value: "cs",
        },
        {
            label: "bahasa Indonesia",
            value: "id",
        },
        {
            label: "italiano",
            value: "it",
        },
        {
            label: "Nederlands",
            value: "nl",
        },
        {
            label: "Polskie",
            value: "pl",
        },
        {
            label: "Український",
            value: "uk",
        },
    ],
    /**
     * 获取 系统配置 文件路径
     * @static
     * @returns
     * @memberof ElectronIntlUniversal
     */
    getSystemConfigFilePath: () => {
        const { app } = require("electron");
        let userDataPath = app.getPath("userData");
        let filePath = userDataPath + "/system_config.json";
        return filePath;
    },
    /**
     *读取系统配置文件
     *
     * @static
     * @memberof ElectronIntlUniversal
     */
    readSystemConfig: () => {
        let filePath = ElectronIntlUniversal.getSystemConfigFilePath();
        let systemConfigData = undefined;
        try {
            systemConfigData = fs.readFileSync(filePath, "utf-8");
        } catch (e) {
            Log.error("[cmd=readSystemConfig] error", filePath, e);
        }
        if (systemConfigData !== undefined) {
            systemConfigData = JSON.parse(systemConfigData);
        } else {
            let userLocale = app.getLocale();
            let locale = undefined;
            for (let l of ElectronIntlUniversal.LOCALES.values()) {
                if (userLocale.startsWith(l.value)) {
                    locale = l.value;
                }
            }
            if (locale === undefined) {
                locale = "en";
            }
            systemConfigData = { lang: locale };
        }
        return systemConfigData;
    },
};
module.exports = ElectronIntlUniversal;
