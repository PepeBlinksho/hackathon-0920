import typography from '@tailwindcss/typography'
/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,vue}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography,
    daisyui,
  ],
  daisyui: {
    themes: ['sunset'], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
  },
}
