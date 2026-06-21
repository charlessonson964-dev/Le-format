import { useTranslation } from "react-i18next";
import ConverterCard from "../components/ConverterCard";
import Hero from "../components/Hero";

const features = [
    { key: "fast", accent: "border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-100" },
    { key: "real", accent: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-100" },
    { key: "control", accent: "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-100" },
];

export default function Home() {
    const { t } = useTranslation();

    return (
        <div className="bg-slate-50 dark:bg-slate-950">
            <Hero />

            <div id="convert" className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 scroll-mt-20">
                <ConverterCard />
            </div>

            <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2 md:grid-cols-3">
                {features.map((feature) => (
                    <article
                        key={feature.key}
                        className={`rounded-lg border p-5 shadow-sm ${feature.accent}`}
                    >
                        <h3 className="text-lg font-black">{t(`home.features.${feature.key}.title`)}</h3>
                        <p className="mt-3 text-sm leading-6 opacity-80">
                            {t(`home.features.${feature.key}.desc`)}
                        </p>
                    </article>
                ))}
            </section>
        </div>
    );
}
