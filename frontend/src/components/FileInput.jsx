import { useId } from "react";
import Input from "./Input";

export default function FileInput({
    onChange,
    fileName,
    accept = "*",
    multiple = false,
    disabled = false,
    label = "Fichye",
}) {
    const id = useId();

    return (
        <div className="w-full">
            {/* INPUT DISPLAY (using Input component) */}
            <Input
                label={label}
                readOnly
                value={fileName || ""}
                placeholder="Pa gen fichye chwazi"
                disabled={disabled}
                onClick={() => !disabled && document.getElementById(id).click()}
            />

            {/* DROP AREA */}
            <div
                className={`
          border-2 border-dashed rounded-xl p-6 text-center mt-3 transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-500 cursor-pointer"}
          border-gray-300
        `}
                onClick={() => !disabled && document.getElementById(id).click()}
            >
                <input
                    id={id}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={(e) => {
                        const files = multiple ? e.target.files : e.target.files[0];
                        onChange?.(files);
                    }}
                    className="hidden"
                />

                <p className="text-gray-600 text-sm">
                    Klike pou chwazi yon fichye oswa drop li la
                </p>
            </div>
        </div>
    );
}