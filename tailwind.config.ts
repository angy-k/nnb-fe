import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: { min: '1px', max: '599px' },
      md: { min: '600px', max: '1299px' },
      lg: '1300px'
    },
    extend: {
      colors: {
        darkBlue: '#261A54',
        lightBlue: '#56C4CF',
        orange: '#F18020',
        darkOrange: '#EC4923',
        yellow: '#FACE06',
        green: '#8CC886',
        white: '#F0F0F0',
        black: '#1B1B1B',
        gray: '#808080',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
