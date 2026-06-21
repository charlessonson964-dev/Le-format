import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDownloadUrl } from "../api/converter";
import { useConvert, useFormats } from "../hooks/useFormats";

const ACCEPTED_EXTENSIONS = [
    "pdf", "docx", "xlsx", "csv", "json", "png", "jpg", "jpeg", "svg",
];

function getExtension(fileName = "") {
    return fileName.split(".").pop()?.toLowerCase() || "";
}

function formatBytes(size = 0) {
    if (!size) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let value = size;
    let index = 0;
    while (value >= 1024 && index < units.length - 1) {
        value /= 1024;
        index += 1;
    }
    return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function ConverterCard() {
    const fileInputRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [file, setFile] = useState(null);
    const requestedSource = searchParams.get("from")?.toLowerCase() || "";
    const requestedTarget = searchParams.get("to")?.toLowerCase() || "";
    const [targetFormat, setTargetFormat] = useState(requestedTarget);
    const [dragging, setDragging] = useState(false);
    const [localError, setLocalError] = useState("");

    const { formats, loading: formatsLoading, error: formatsError } = useFormats();
    const { convert, result, loading, error, reset } = useConvert();

    const sourceExt = getExtension(file?.name);
    const activeSource = sourceExt || requestedSource;

    const availableTargets = useMemo(() => {
        if (!activeSource || !formats?.by_source?.[activeSource]) return [];
        return formats.by_source[activeSource].map((item) => item.target);
    }, [formats, activeSource]);

    const accept = ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`).join(",");
    const canConvert = file && targetFormat && !loading;

    function chooseFile(nextFile) {
        reset();
        setLocalError("");
        setTargetFormat("");

        if (!nextFile) {
            setFile(null);
            return;
        }

        const ext = getExtension(nextFile.name);
        if (!ACCEPTED_EXTENSIONS.includes(ext)) {
            setFile(null);
            setLocalError(`Fòma .${ext || "unknown"} pa sipòte.`);
            return;
        }

        setFile(nextFile);

        const requestedConversionIsValid = ext === requestedSource && availableTargets.includes(requestedTarget);
        if (!requestedConversionIsValid && requestedSource && ext !== requestedSource) {
            setTargetFormat("");
            setLocalError(`Konvèsyon ou te chwazi a mande yon fichye .${requestedSource.toUpperCase()}.`);
            return;
        }

        if (requestedTarget) {
            setTargetFormat(requestedTarget);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLocalError("");

        if (!file) {
            setLocalError("Chwazi yon fichye avan.");
            return;
        }

        if (!targetFormat) {
            setLocalError("Chwazi fòma ou vle jwenn nan.");
            return;
        }

        await convert(file, targetFormat);
    }

    function clearAll() {
        setFile(null);
        setTargetFormat("");
        setLocalError("");
        reset();
        setSearchParams({});
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    return (
        <section id="convert" className="relative">
            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_90px_rgba(15,23,42,0.14)]"
            >
                <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
                    <div className="p-5 sm:p-7">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                                    {requestedSource && requestedTarget
                                        ? `${requestedSource.toUpperCase()} to ${requestedTarget.toUpperCase()}`
                                        : "Konvètisè"}
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                                    Chwazi, konvèti, telechaje
                                </h2>
                            </div>
                            <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                API live
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(event) => {
                                event.preventDefault();
                                setDragging(true);
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={(event) => {
                                event.preventDefault();
                                setDragging(false);
                                chooseFile(event.dataTransfer.files?.[0]);
                            }}
                            className={[
                                "group flex min-h-52 w-full flex-col items-center justify-center rounded-lg border border-dashed px-5 py-8 text-center transition",
                                dragging
                                    ? "border-cyan-500 bg-cyan-50"
                                    : "border-slate-300 bg-slate-50 hover:border-slate-500 hover:bg-white",
                            ].join(" ")}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={accept}
                                className="hidden"
                                onChange={(event) => chooseFile(event.target.files?.[0])}
                            />
                            <span className="mb-4 grid h-14 w-14 place-items-center rounded-lg bg-slate-950 text-xl font-black text-white shadow-lg shadow-slate-300">
                                LF
                            </span>
                            <span className="text-lg font-semibold text-slate-950">
                                {file ? file.name : "Glise fichye a isit la"}
                            </span>
                            <span className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                                {file
                                    ? `${formatBytes(file.size)} · ${sourceExt.toUpperCase()}`
                                    : requestedSource
                                        ? `Klike pou chwazi yon fichye ${requestedSource.toUpperCase()} pou konvèti an ${requestedTarget.toUpperCase()}.`
                                        : "Oswa klike pou chwazi yon PDF, DOCX, CSV, XLSX, imaj, JSON, SVG."}
                            </span>
                        </button>

                        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Soti nan
                                </label>
                                <div className="h-12 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold uppercase text-slate-800">
                                    {activeSource || "Auto"}
                                </div>
                            </div>

                            <div className="hidden pb-3 text-slate-400 sm:block">to</div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Ale nan
                                </label>
                                <select
                                    value={targetFormat}
                                    disabled={!file || formatsLoading || loading || availableTargets.length === 0}
                                    onChange={(event) => setTargetFormat(event.target.value)}
                                    className="h-12 w-full rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-100 disabled:text-slate-400"
                                >
                                    <option value="">
                                        {formatsLoading ? "Chajman..." : "Chwazi output"}
                                    </option>
                                    {availableTargets.map((format) => (
                                        <option key={format} value={format}>
                                            {format.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {file && availableTargets.length === 0 && !formatsLoading && (
                            <p className="mt-3 rounded-md bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                                Backend lan pa gen konvèsyon disponib pou .{sourceExt}.
                            </p>
                        )}

                        {(localError || error || formatsError) && (
                            <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                                {localError || error || "Pa ka kontakte backend lan. Verifye server API a sou port 8000."}
                            </p>
                        )}

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="submit"
                                disabled={!canConvert}
                                className="h-12 flex-1 rounded-md bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {loading ? "Konvèsyon ap fèt..." : "Konvèti fichye a"}
                            </button>
                            <button
                                type="button"
                                onClick={clearAll}
                                className="h-12 rounded-md border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <aside className="border-t border-slate-200 bg-slate-950 p-5 text-white sm:p-7 lg:border-l lg:border-t-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                            Rezilta
                        </p>

                        {result ? (
                            <div className="mt-5 space-y-5">
                                <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4">
                                    <p className="text-sm text-slate-300">Konvèsyon</p>
                                    <p className="mt-1 text-xl font-bold">{result.conversion}</p>
                                    <p className="mt-3 break-words text-sm text-slate-300">
                                        {result.output_name} · {result.size_human}
                                    </p>
                                </div>
                                <a
                                    href={getDownloadUrl(result.job_id, result.output_name)}
                                    className="flex h-12 items-center justify-center rounded-md bg-amber-300 px-5 text-sm font-black text-slate-950 transition hover:bg-amber-200"
                                >
                                    Telechaje fichye a
                                </a>
                                <p className="text-xs leading-5 text-slate-400">
                                    Fichye a disponib jiska {new Date(result.expires_at).toLocaleTimeString()}.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-5 grid gap-3">
                                {[
                                    ["1", "Chwazi fichye ou vle konvèti a."],
                                    ["2", "Chwazi output ki disponib pou kalite fichye a."],
                                    ["3", "Telechaje rezilta a dirèkteman ."],
                                ].map(([step, text]) => (
                                    <div key={step} className="flex gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white text-sm font-black text-slate-950">
                                            {step}
                                        </span>
                                        <p className="text-sm leading-6 text-slate-300">{text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </aside>
                </div>
            </form>
        </section>
    );
}
