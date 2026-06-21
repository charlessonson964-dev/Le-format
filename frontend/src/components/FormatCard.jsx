import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function FormatCard({ convKey, label }) {
    const [src, tgt] = convKey.split("→");
    const { t } = useTranslation();

    return (
        <Link
            to={`/?from=${src}&to=${tgt}#convert`}
            className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-600 dark:focus:ring-cyan-900"
        >
            <div className="flex items-center justify-between gap-3">
                <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                    {src}
                </span>
                <span className="text-sm font-black text-cyan-700 dark:text-cyan-400">to</span>
                <span className="rounded-md bg-amber-100 px-3 py-1 text-xs font-black uppercase text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
                    {tgt}
                </span>
            </div>
            <p className="mt-4 min-h-10 text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">
                {label}
            </p>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-400">
                {t("formats.convert_now")}
            </p>
        </Link>
    );
}
