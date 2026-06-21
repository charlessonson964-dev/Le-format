import { useTranslation } from "react-i18next";
import heroImage from "../assets/hero.png";

export default function Hero() {
    const { t } = useTranslation();

    return (
        <section className="relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(8,145,178,0.32),transparent_38%),linear-gradient(245deg,rgba(245,158,11,0.22),transparent_42%)]" />
            <div className="relative mx-auto grid min-h-[520px] max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
                <div>
                    <p className="mb-5 inline-flex rounded-md border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">
                        {t("hero.badge")}
                    </p>
                    <h1 className="max-w-3xl text-2xl font-black leading-tight text-white sm:text-4xl lg:text-4xl xl:text-5xl">
                        {t("hero.title")}
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                        {t("hero.subtitle")}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        {[t("hero.stats.conversions"), t("hero.stats.instant"), t("hero.stats.cleanup")].map((item) => (
                            <span key={item} className="rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-950">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="relative hidden min-h-80 items-center justify-center lg:flex">
                    <div className="absolute h-72 w-72 rounded-lg bg-cyan-300/15 blur-2xl" />
                    <img
                        src={heroImage}
                        alt="Le Format conversion layers"
                        className="relative w-full max-w-sm drop-shadow-[0_38px_55px_rgba(0,0,0,0.5)]"
                    />
                </div>
            </div>
        </section>
    );
}
