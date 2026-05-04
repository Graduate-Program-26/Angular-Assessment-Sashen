/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts,scss}',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        moon: {
          DEFAULT:  '#c8a96e',  
          subtle:   '#f5e6c8',  
        },
        night: {
          DEFAULT:  '#0a0a0f', 
          surface:  '#111118',  
          surface2: '#18181f', 
        },
        frost: {
          DEFAULT:  '#7c9ef5',  
          subtle:   '#bfcffe',
        },
        jade: {
          DEFAULT:  '#5ecfb0',  
        },
      },

      fontFamily: {
        sans:  ['DM Sans', 'sans-serif'],
        head:  ['Syne',    'sans-serif'],
        mono:  ['DM Mono', 'monospace'],
      },

      borderRadius: {
        DEFAULT: '10px',
        xl:      '16px',
        '2xl':   '22px',
      },

      boxShadow: {
        moon: '0 0 30px rgba(200,169,110,0.15)',
        frost: '0 0 30px rgba(124,158,245,0.15)',
      },
    },
  },

  plugins: [],
};
