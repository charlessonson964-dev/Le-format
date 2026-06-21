import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={t("theme.toggle")}
            title={isDark ? t("theme.light") : t("theme.dark")}
            className={`grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-base transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 ${className}`}
        >
            {isDark ? "☀" : "☾"}
        </button>
    );
}
