/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: '#0f0f14',
                    secondary: '#16161e',
                    tertiary: '#1c1c28',
                    surface: '#22223a',
                    hover: '#2a2a44',
                    active: '#33335a',
                },
                text: {
                    primary: '#e8e8f0',
                    secondary: '#9a9ab8',
                    muted: '#6a6a88',
                    accent: '#a78bfa',
                },
                accent: {
                    primary: '#7c3aed',
                    secondary: '#a78bfa',
                    tertiary: '#c4b5fd',
                    glow: 'rgba(124, 58, 237, 0.25)',
                    'glow-strong': 'rgba(124, 58, 237, 0.45)',
                },
                success: '#34d399',
                warning: '#fbbf24',
                error: '#f87171',
                info: '#60a5fa',
                border: {
                    DEFAULT: '#2a2a3e',
                    hover: '#3d3d5c',
                    focus: '#7c3aed', // matches accent-primary
                },
                glass: {
                    bg: 'rgba(22, 22, 30, 0.75)',
                    border: 'rgba(255, 255, 255, 0.06)',
                }
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            boxShadow: {
                glow: '0 0 20px rgba(124, 58, 237, 0.25)',
            },
            transitionDuration: {
                fast: '150ms',
                normal: '250ms',
                slow: '400ms',
            },
            transitionTimingFunction: {
                DEFAULT: 'cubic-bezier(.4, 0, .2, 1)',
            },
            backdropBlur: {
                glass: '16px',
            },
            width: {
                sidebar: '260px',
            },
            height: {
                toolbar: '52px',
            }
        },
    },
    plugins: [],
}
