/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/*.{vue,js,ts,jsx,tsx}",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'success': '#4B9C4E',
                'error': '#F05D5D',
                'warning': '#C8A345',
                'second': '#294a7a',
                'second-active': '#3864a7',
                'primary': '#151617',
            },
            flex: {
                '2': '2 2 0%'
            }
        }
    },
    plugins: [],
    safelist: [
        {
            pattern: /(bg|text|border|top|left)-((\w+)(|-\d{3})|\[\#.*\])/
        }

    ]
}

