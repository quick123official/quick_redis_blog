import { GLOBAL_CONFIG } from "@/utils/constant";
import Log from "@/services/LogService";
let fs = window.require("fs");
const { remote } = window.require("electron");

export default class LocaleUtils {
    /**
     *支持的语言
     *
     * @static
     * @memberof LocaleUtils
     */
    static LOCALES = [
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
    ];
    /**
     * 获取 系统配置 文件路径
     * @static
     * @returns
     * @memberof LocaleUtils
     */
    static getSystemConfigFilePath() {
        const { remote } = window.require("electron");
        let userDataPath = remote.app.getPath("userData");
        let filePath = userDataPath + "/" + GLOBAL_CONFIG.SYSTEM_CONFIG_FILE;
        return filePath;
    }
    static systemConfigData = null;
    /**
     *读取系统配置文件
     *
     * @static
     * @param {*} forceIo true表示强制读取本地文件
     * @returns
     * @memberof LocaleUtils
     */
    static readSystemConfig(forceIo) {
        if (this.systemConfigData !== null && forceIo === false) {
            return this.systemConfigData;
        }
        let filePath = this.getSystemConfigFilePath();
        let systemConfigDataTemp = undefined;
        try {
            systemConfigDataTemp = fs.readFileSync(filePath, "utf-8");
        } catch (e) {
            Log.error(
                "[cmd=LocaleUtils] readSystemConfig error",
                filePath,
                forceIo,
                e
            );
        }
        if (systemConfigDataTemp !== undefined) {
            systemConfigDataTemp = JSON.parse(systemConfigDataTemp);
        } else {
            let userLocale = remote.app.getLocale();
            let locale = undefined;
            for (let l of LocaleUtils.LOCALES.values()) {
                if (userLocale.startsWith(l.value)) {
                    locale = l.value;
                }
            }
            if (locale === undefined) {
                locale = "en";
            }
            // splitSign 默认设置为 :
            systemConfigDataTemp = {
                lang: locale,
                splitSign: ":",
                autoFormatJson: true,
            };
            this.saveSystemConfig(systemConfigDataTemp);
        }
        this.systemConfigData = systemConfigDataTemp;
        return this.systemConfigData;
    }
    /**
     * 保存系统配置文件
     *
     * @static
     * @param {*} systemConfigData
     * @memberof LocaleUtils
     */
    static saveSystemConfig(systemConfigData) {
        let strData = JSON.stringify(systemConfigData);
        let filePath = this.getSystemConfigFilePath();
        try {
            fs.writeFileSync(filePath, strData, "utf-8");
        } catch (e) {
            Log.error("[cmd=LocaleUtils] saveSystemConfig error", filePath, e);
        }
        this.readSystemConfig(true);
    }
}
