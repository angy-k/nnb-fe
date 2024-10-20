import type { Config } from 'tailwindcss'
const defaultTheme = require('tailwindcss/defaultTheme')

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
      fontFamily: {
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
        libre: ['MADE GoodTime Script']
      },
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
      fontSize: {
        xxxxs: '2px',
        xxxs: '3px',
        xxs: '5px',
        10: '10px',
        11: '11px',
        23: '23px',
        35: '35px'
      },
      spacing: {
        '10%': '10%',
        '25%': '25%',
        13: '52px',
        17: '4.25rem',
        18: '4.5rem',
        103: '103%',
        90: '90px',
        125: '125px',
        185: '185px',
        200: '200px',
        380: '380px',
        385: '385px',
        500: '500px',
        600: '600px'
      },
      maxWidth: {
        90: '90px',
        65: '65px',
        75: '75px',
        140: '140px',
        160: '160px',
        185: '185px',
        248: '248px',
      },
      minWidth: {
        6: '24px',
        9: '36px',
        16: '80px',
        20: '20px',
        24: '24px',
        28: '28px',
        50: '50px',
        90: '90px',
        110: '110px',
        136: '136px',
        140: '140px',
        145: '145px',
        152: '152px',
        185: '185px',
        200: '200px',
        384: '384px',
      },
      borderWidth: {
        5: '5px',
        6: '6px'
      },
      minHeight: {
        16: '80px',
        5: '20px',
        24: '24px',
        50: '50px',
        72: '72px',
        112: '112px',
        135: '135px',
        140: '140px',
        308: '308px',
        800: '800px',
        911: '911px',
      },
      maxHeight: {
        48: '48px'
      },
      screens: {
        mobileMin: '350px',
        mobile: '376px',
        wider_mobile: '400px',
      },
      zIndex: {
        1: '1',
        5: '5',
      },
      lineHeight: {
        22: '22px'
      },
      width: {
        688: '43rem',
        480: '30rem',
        360: '360px',
        430: '430px',
        470: '470px',
        500: '500px',
        530: '530px',
        570: '570px',
        1400: '1400px',
        1440: '1440px'
      },
      height: {
        5.5: '1.375rem',
        375: '375px',
        450: '450px',
      },
      flex: {
        '10%': '0 0 10%',
        '30%': '0 0 30%',
        '70%': '0 0 70%',
      },
      lineClamp: {
        12: '12',
        9: '9',
        7: '7',
      },
      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    }
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config
