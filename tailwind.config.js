/** @type {import('tailwindcss').Config} */
function range(start, end, increment = 1) {
  const count = Math.floor((end - start + increment) / increment);
  return Array(count)
    .fill(0)
    .map((_, idx) => start + idx * increment);
}

const minFontSize = 5;
const maxFontSize = 80;

const minSpacingPixel = 0;
const maxSpacingPixel = 800;
const spacingPixelIncrement = 5;

const vhs = ['10vh', '20vh', '30vh', '40vh', '50vh', '60vh', '70vh', '80vh', '90vh', '100vh'];
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    // Extend default configurations
    extend: {
      colors: {
        bgheader: '#222222',
        bgfooter: '#333333',
        blue: '#0040c1',
        white: '#ffffff',
        lightblue: '#2d9bf0',
        flexblue: '#4986E8',
        hoverblue: '#275ecb',
        disableblue: '#6082c6',
        black: '#000000',
        dark: '#1a1a1a',
        grey: '#a9a9a9',
        lightgrey: '#e6e6e6',
        modalbg: 'rgba(0, 0, 0, 0.3)',
        'home-text': '#666',
      },
      screens: {
        '2xs': '380px',
        xs: '480px',
        sm: '640px',
        md: '876px',
        slg: '964px',
        lg: '1024px',
        xl: '1180px',
        '2xl': '1280px',
        '3xl': '1560px',
      },
    },
    // Override default configurations
    fontWeight: {
      normal: 500,
      medium: 600,
      bold: 700,
      extra: 800,
      black: 900,
    },
    fontSize: {
      ...range(minFontSize, maxFontSize).reduce((merged, f) => ({ ...merged, [f]: `${f}px` }), {}),
    },
    spacing: {
      ...range(minSpacingPixel, maxSpacingPixel, spacingPixelIncrement).reduce(
        (merged, f) => ({ ...merged, [f]: `${f}px` }),
        {}
      ),
    },
    maxWidth: {
      ...range(minSpacingPixel, maxSpacingPixel, spacingPixelIncrement).reduce(
        (merged, f) => ({ ...merged, [f]: `${f}px` }),
        {}
      ),
    },
    minWidth: {
      ...range(minSpacingPixel, maxSpacingPixel, spacingPixelIncrement).reduce(
        (merged, f) => ({ ...merged, [f]: `${f}px` }),
        {}
      ),
    },
    maxHeight: {
      ...range(minSpacingPixel, maxSpacingPixel, spacingPixelIncrement).reduce(
        (merged, f) => ({ ...merged, [f]: `${f}px` }),
        {}
      ),
      ...vhs.reduce((merged, vh) => ({ ...merged, [vh]: vh }), {}),
    },
    minHeight: {
      ...range(minSpacingPixel, maxSpacingPixel, spacingPixelIncrement).reduce(
        (merged, f) => ({ ...merged, [f]: `${f}px` }),
        {}
      ),
      ...vhs.reduce((merged, vh) => ({ ...merged, [vh]: vh }), {}),
    },
  },
  plugins: [],
};
