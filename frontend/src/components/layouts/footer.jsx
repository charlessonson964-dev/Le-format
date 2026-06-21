import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();

    const i18nLinks = [
        { href: "/", key: "nav.home" },
        { href: "/formats", key: "nav.formats" },
        { href: "/how", key: "nav.how" },
    ];

    return (
        <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-sm font-black text-white dark:bg-white dark:text-slate-950">
                            LF
                        </span>
                        <h2 className="text-lg font-black text-slate-950 dark:text-white">
                            {t("brand.name")}
                        </h2>
                    </div>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {t("footer.tagline")}
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        {t("footer.pages_title")}
                    </h3>
                    <div className="mt-4 grid gap-2">
                        {i18nLinks.map((link) => (
                            <NavLink
                                key={link.href}
                                to={link.href}
                                className="text-sm font-semibold text-slate-700 hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-400"
                            >
                                {t(link.key)}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-sm font-black text-slate-950 dark:text-white">
                        {t("footer.status_title")}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {t("footer.status_url")}{" "}
                        <span className="font-bold text-slate-950 dark:text-white">
                            http://localhost:8000/api/v1
                        </span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {t("footer.status_hint")}
                    </p>
                </div>
            </div>
            <div className="border-t border-slate-200 px-4 py-4 text-center text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                {t("footer.copyright", { year: new Date().getFullYear() })}
            </div>
        </footer>
    );
}
