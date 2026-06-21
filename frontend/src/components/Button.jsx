export default function Button({
    children,
    onClick,
    loading = false,
    disabled = false,
    type = "button",
    variant = "primary",
    className = "",
}) {
    const baseStyle =
        "px-4 py-2 rounded-lg font-medium transition-all duration-200";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        success: "bg-green-600 text-white hover:bg-green-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            className={`
        ${baseStyle}
        ${variants[variant] || variants.primary}
        ${loading || disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
        >
            {loading ? "Ap travay..." : children}
        </button>
    );
}