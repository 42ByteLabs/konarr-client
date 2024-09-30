const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    darkMode: 'selector',
    theme: {
        colors: {
            // Main colors
            primary: colors.primary, 
            secondary: colors.secondary,
            // Accent
            accent: colors.pink,

            transparent: 'transparent',
            current: 'currentColor',
            black: '#0D0D0D',
            white: colors.white,
            gray: colors.gray,
            red: colors.red,
            yellow: colors.amber,
            green: colors.emerald,
            blue: colors.blue,
            pink: colors.pink,
        },
        extend: {
            gridTemplateColumns: {
                '16': 'repeat(16, minmax(0, 1fr))',
                'footer': '200px minmax(900px, 1fr) 100px',
            },
            animation: {
                progress: 'progress 1s infinite linear',
            },
            keyframes: {
                progress: {
                    '0%': { transform: ' translateX(0) scaleX(0)' },
                    '40%': { transform: 'translateX(0) scaleX(0.4)' },
                    '100%': { transform: 'translateX(100%) scaleX(0.5)' },
                },
            },
            transformOrigin: {
                'left-right': '0% 50%',
            }
        }
    },
    plugins: [],
}

