/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-blue': '#00f3ff',
                'neon-pink': '#bc13fe',
                'dark-bg': '#0a0b1e',
            },
            fontFamily: {
                'mono': ['"Courier New"', 'Courier', 'monospace'],
            }
        },
    },
    plugins: [],
}
