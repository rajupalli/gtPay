import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        primary: '#FFA500',
        secondary: '#ED1B4A',
        greenSubmit: '#42B824',
        greenText: '#657D59',
        grey: '#505050',
        blue: '#1B2559',
        stocksRed: '#D31812',
        stocksGreen: '#289317',
        adminGrey: '#A6A6A6',
        paymentGrey: '#7D7D7D'
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(135deg, #FFA500, #000000)',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
