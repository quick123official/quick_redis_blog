import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import LocaleUtils from "@/utils/LocaleUtils";

const ThemeContext = createContext();

/**
 * 主题配置常量
 */
export const THEME_MODE = {
    LIGHT: "light",
    DARK: "dark",
    SYSTEM: "system", // 跟随系统
};

/**
 * 获取初始主题（启动时）
 */
function getInitialTheme() {
    try {
        const savedConfig = LocaleUtils.readSystemConfig(false);
        const savedTheme = savedConfig?.theme;
        if (savedTheme && (savedTheme === THEME_MODE.LIGHT || savedTheme === THEME_MODE.DARK || savedTheme === THEME_MODE.SYSTEM)) {
            return savedTheme;
        }
    } catch (e) {
        // ignore
    }
    return THEME_MODE.SYSTEM; // 默认跟随系统
}

/**
 * 根据主题模式获取实际的颜色主题（light/dark）
 */
function resolveActualTheme(themeMode) {
    const { ipcRenderer } = window.require("electron");
    return new Promise((resolve) => {
        if (themeMode === THEME_MODE.SYSTEM) {
            // 从主进程获取系统主题
            ipcRenderer.once("current-theme-reply", (event, arg) => {
                resolve(arg.theme);
            });
            ipcRenderer.send("get-current-theme", {});
            // 超时兜底
            setTimeout(() => resolve("light"), 1000);
        } else {
            resolve(themeMode);
        }
    });
}

export function ThemeProvider({ children }) {
    const [themeMode, setThemeMode] = useState(getInitialTheme);
    const [actualTheme, setActualTheme] = useState("light");
    const [isLoading, setIsLoading] = useState(true);

    // 初始化实际主题
    useEffect(() => {
        let cancelled = false;
        resolveActualTheme(themeMode).then((resolved) => {
            if (!cancelled) {
                setActualTheme(resolved);
                setIsLoading(false);
            }
        });
        return () => {
            cancelled = true;
        };
    }, []);

    // 监听主进程的系统主题变化（当 themeMode 为 system 时才生效）
    useEffect(() => {
        if (themeMode !== THEME_MODE.SYSTEM) return;

        const { ipcRenderer } = window.require("electron");
        const handler = (event, arg) => {
            setActualTheme(arg.theme);
        };
        ipcRenderer.on("theme-changed", handler);
        return () => {
            ipcRenderer.removeListener("theme-changed", handler);
        };
    }, [themeMode]);

    /**
     * 切换主题
     */
    const setTheme = useCallback((newThemeMode) => {
        if (newThemeMode === themeMode) return;

        setThemeMode(newThemeMode);

        // 持久化保存
        const savedConfig = LocaleUtils.readSystemConfig(false) || {};
        savedConfig.theme = newThemeMode;
        LocaleUtils.saveSystemConfig(savedConfig);

        // 通知主进程设置主题
        try {
            const { ipcRenderer } = window.require("electron");
            ipcRenderer.send("set-theme", { theme: newThemeMode });
        } catch (e) {
            // ignore
        }

        // 更新实际主题
        resolveActualTheme(newThemeMode).then((resolved) => {
            setActualTheme(resolved);
        });
    }, [themeMode]);

    /**
     * 切换深色/浅色（用于快捷键等）
     */
    const toggleTheme = useCallback(() => {
        setTheme(actualTheme === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT);
    }, [actualTheme, setTheme]);

    const value = {
        themeMode,     // 用户选择的模式：light/dark/system
        actualTheme,   // 实际生效的主题：light/dark
        isDark: actualTheme === THEME_MODE.DARK,
        setTheme,
        toggleTheme,
        isLoading,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Hook: 在组件中获取主题
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

export default ThemeContext;
