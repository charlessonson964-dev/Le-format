import { useId } from "react";

export default function Input({
    label,
    error,
    className = "",
    disabled = false,
    id,
    ...props
}) {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block mb-2 text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}

            <input
                id={inputId}
                disabled={disabled}
                {...props}
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
            />

            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
