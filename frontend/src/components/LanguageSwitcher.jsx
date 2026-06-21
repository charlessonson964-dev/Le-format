import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../i18n";

export default function LanguageSwitcher({ className = "" }) {
    const { i18n, t } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const current = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language)
        || SUPPORTED_LANGUAGES[1];

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={t("language.change")}
                aria-expanded={open}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            >
                <span className="text-base leading-none">{current.flag}</span>
                <span className="hidden sm:inline">{current.label}</span>
                <span className="text-xs">▾</span>
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                        const active = i18n.language === lang.code;
                        return (
                            <button
                                key={lang.code}
                                type="button"
                                onClick={() => {
                                    i18n.changeLanguage(lang.code);
                                    setOpen(false);
                                }}
                                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition ${active
                                        ? "bg-cyan-50 font-bold text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200"
                                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <span className="text-base leading-none">{lang.flag}</span>
                                <span className="flex-1">{lang.label}</span>
                                {active && <span className="text-xs">✓</span>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
