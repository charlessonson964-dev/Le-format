import { useTranslation } from "react-i18next";

export default function HowItWorks() {
    const { t } = useTranslation();
    const steps = [
        { key: "1" },
        { key: "2" },
        { key: "3" },
    ];
    const noteKeys = ["1", "2", "3"];

    return (
        <div className="bg-slate-50 px-4 py-12 dark:bg-slate-950">
            <section className="mx-auto max-w-5xl">
                <div className="rounded-lg bg-slate-950 px-5 py-10 text-white shadow-xl sm:px-8 md:py-14 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
                        {t("nav.how")}
                    </p>
                    <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
                        {t("how.subtitle")}
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                        {t("how.lead")}
                    </p>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <article
                            key={step.key}
                            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                        >
                            <span className="grid h-10 w-10 place-items-center rounded-md bg-cyan-600 text-sm font-black text-white">
                                {index + 1}
                            </span>
                            <h2 className="mt-5 text-xl font-black text-slate-950 dark:text-white">
                                {t(`how.steps.${step.key}.title`)}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {t(`how.steps.${step.key}.text`)}
                            </p>
                        </article>
                    ))}
                </div>

                <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                        {t("how.notes_title")}
                    </h2>
                    <div className="mt-5 grid gap-3">
                        {noteKeys.map((k) => (
                            <div
                                key={k}
                                className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200"
                            >
                                {t(`how.notes.${k}`)}
                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </div>
    );
}
