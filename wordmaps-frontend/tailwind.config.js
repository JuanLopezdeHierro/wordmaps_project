/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-blue': '#0ea5e9', // Sky 500
                'neon-pink': '#d946ef', // Fuchsia 500
                'dark-bg': '#fdfdfd',   // Actually Light BG now
            },
            fontFamily: {
                mono: ['"Share Tech Mono"', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
