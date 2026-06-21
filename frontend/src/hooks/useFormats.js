import { useState, useEffect } from "react";
import {
    getFormats,
    convertDocument,
    getDownloadUrl,
    deleteJobFile,
} from "../api/converter";

// ── 1. useFormats ─────────────────────────────────────
export function useFormats() {
    const [formats, setFormats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getFormats()
            .then((data) => {
                setFormats(data);
            })
            .catch((err) => {
                console.error("useFormats erè:", err);
                setError(err);
            })
            .finally(() => setLoading(false));
    }, []);

    return { formats, loading, error };
}
// ── 2. useConvert ─────────────────────────────────────
export function useConvert() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const convert = async (file, targetFormat) => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await convertDocument(file, targetFormat);
            setResult(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.detail || "Erè pandan konvèsyon");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setResult(null);
        setError(null);
    };

    return { convert, result, loading, error, reset };
}

// ── 3. useDownload ────────────────────────────────────
export function useDownload() {
    const download = (job_id, filename) => {
        const url = getDownloadUrl(job_id, filename);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
    };

    return { download };
}

// ── 4. useDeleteJob ───────────────────────────────────
export function useDeleteJob() {
    const [loading, setLoading] = useState(false);

    const deleteJob = async (job_id, filename) => {
        setLoading(true);
        try {
            await deleteJobFile(job_id, filename);
        } finally {
            setLoading(false);
        }
    };

    return { deleteJob, loading };
}