export default function SelectFormat({
    value,
    onChange,
    label,
    error,
    disabled = false,
    className = "",
}) {
    const formats = ["pdf", "docx", "md", "html", "txt", "csv"];

    return (
        <div className="w-full">
            {label && (
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <select
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className={`
                w-full px-4 py-3
                border rounded-lg
                outline-none
                transition-all duration-200
                focus:ring-2 focus:ring-blue-500
                focus:border-blue-500
                ${error ? "border-red-500" : "border-gray-300"}
                ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
                ${className}
                `}
            >
                <option value="" disabled>
                    Chwazi yon fòma
                </option>

                {formats.map((f) => (
                    <option key={f} value={f}>
                        {f.toUpperCase()}
                    </option>
                ))}
            </select>

            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}