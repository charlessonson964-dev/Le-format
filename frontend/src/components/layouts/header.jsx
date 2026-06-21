import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../ThemeToggle";
import LanguageSwitcher from "../LanguageSwitcher";

export default function Header() {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const i18nLinks = [
        { href: "/", key: "nav.home" },
        { href: "/formats", key: "nav.formats" },
        { href: "/how", key: "nav.how" },
    ];

    const linkClass = ({ isActive }) =>
        [
            "rounded-md px-3 py-2 text-sm font-bold transition",
            isActive
                ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
        ].join(" ");

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
                <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-sm font-black text-white dark:bg-white dark:text-slate-950">
                        LF
                    </span>
                    <span className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
                        {t("brand.name")}
                    </span>
                </NavLink>

                <nav className="hidden items-center gap-1 md:flex">
                    {i18nLinks.map((link) => (
                        <NavLink key={link.href} to={link.href} className={linkClass}>
                            {t(link.key)}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <a
                        href="/#convert"
                        className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-950 dark:hover:bg-white dark:hover:text-slate-950"
                    >
                        {t("cta.start")}
                    </a>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-xl font-bold text-slate-900 dark:border-slate-700 dark:text-slate-100 md:hidden"
                    aria-label={open ? "Close menu" : "Open menu"}
                >
                    {open ? "✕" : "≡"}
                </button>
            </div>

            {open && (
                <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
                    <nav className="mx-auto grid max-w-6xl gap-2">
                        {i18nLinks.map((link) => (
                            <NavLink
                                key={link.href}
                                to={link.href}
                                className={linkClass}
                                onClick={() => setOpen(false)}
                            >
                                {t(link.key)}
                            </NavLink>
                        ))}
                        <div className="mt-2 flex items-center gap-2">
                            <LanguageSwitcher className="flex-1" />
                            <ThemeToggle className="flex-shrink-0" />
                        </div>
                        <a
                            href="/#convert"
                            className="rounded-md bg-cyan-600 px-4 py-3 text-center text-sm font-black text-white"
                            onClick={() => setOpen(false)}
                        >
                            {t("cta.start")}
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}
