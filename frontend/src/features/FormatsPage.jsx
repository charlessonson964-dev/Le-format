import { useTranslation } from "react-i18next";
import FormatCard from "../components/FormatCard";
import { useFormats } from "../hooks/useFormats";

export default function FormatsPage() {
    const { formats, loading, error } = useFormats();
    const { t } = useTranslation();
    const conversionList = formats?.conversions ?? [];
    const groups = formats?.by_source ?? {};

    if (loading) {
        return (
            <div className="grid min-h-[55vh] place-items-center bg-slate-50 px-4 dark:bg-slate-950">
                <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />
                    <p className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-200">
                        {t("formats.loading")}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid min-h-[55vh] place-items-center bg-slate-50 px-4 dark:bg-slate-950">
                <div className="max-w-md rounded-lg border border-rose-200 bg-rose-50 p-6 text-center text-rose-800 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-200">
                    <h1 className="text-xl font-black">{t("formats.error_title")}</h1>
                    <p className="mt-2 text-sm leading-6">{t("formats.error_hint")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 px-4 py-12 dark:bg-slate-950">
            <section className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-400">
                            {t("nav.formats")}
                        </p>
                        <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl dark:text-white">
                            {t("formats.title")}
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {t("formats.subtitle")}
                        </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-3xl font-black text-slate-950 dark:text-white">
                            {conversionList.length}
                        </p>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                            {t("formats.count")}
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    {Object.entries(groups).map(([source, items]) => (
                        <section key={source}>
                            <div className="mb-3 flex items-center gap-3">
                                <h2 className="rounded-md bg-slate-950 px-3 py-1 text-sm font-black uppercase text-white dark:bg-white dark:text-slate-950">
                                    {source}
                                </h2>
                                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                    {items.length} {t("formats.outputs")}
                                </span>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {items.map((item) => (
                                    <FormatCard key={item.key} convKey={item.key} label={item.label} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </section>
        </div>
    );
}
