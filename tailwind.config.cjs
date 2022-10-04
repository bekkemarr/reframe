/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ejs,js,jsx,md,mdx,ts,tsx}'],
    theme: {
        extend: {},
    },
    darkMode: 'class',
    plugins: [require('daisyui')],
    // daisyUI config
    daisyui: {
        styled: true,
        themes: ['garden', 'forest'],
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        prefix: '',
        darkTheme: 'forest',
    },
};