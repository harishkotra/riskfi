/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#09090b", // Zinc 950
                surface: "#18181b",    // Zinc 900
                primary: "#3b82f6",    // Blue 500
                accent: "#8b5cf6",     // Violet 500
                danger: "#ef4444",     // Red 500
                success: "#22c55e",    // Green 500
                warning: "#eab308",    // Yellow 500
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'], // Crypto feel
            },
        },
    },
    plugins: [],
}
