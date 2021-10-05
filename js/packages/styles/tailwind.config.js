/**
 * Branding colors copied from 'branding.css'
 *
 * All CSS rules with colors will still exist as CSS variables,
 * but adding them here allows Tailwind to auto-generate some nice
 * rules that we can use. Compared to the color names in the CSS
 * file, the generated Tailwind color rules will replace the '-'
 * with '_'.
 *
 * For example if you want to change the color of an H1 text
 * to "Blue Spirit":
 *
 * CSS:  `style="color: var(--jhu-blue-spirit);"`
 *
 * Tailwind: Simply add this CSS class to the desired element:
 *    "text-blue_spirit"
 */

module.exports = {
  purge: [
    '../glimmer-idc/src/components/**/*.ts',
    '../../../templates/**/*.html.twig',
    '../../../../../../modules/contrib/idc_ui_module/templates/**/*.html.twig',
  ],
  theme: {
    extend: {
      animation: {
        wiggle: 'wiggle 200ms ease-in-out',
      },
      colors: {
        footer: '#2c2c33',
        'footer-link': '#a6bbd5',
        white: '#ffffff',
        'blue-spirit': '#68ACE5',
        'blue-heritage': '#002D72',
        black: '#31261D',
        'black-bg-300': '#F7F6F4',
        'secondary-1': '#CF4520',
        'secondary-2': '#76232F',
        'secondary-3': '#A15A95',
        'secondary-4': '#009B77',
        'secondary-5': '#0072CE',
        'secondary-6': '#F1C400',
        'accent-1': '#CBA052',
        'accent-2': '#FF9E1B',
        'accent-3': '#FF6900',
        'accent-4': '#9E5330',
        'accent-5': '#4F2C1D',
        'accent-6': '#E8927C',
        'accent-7': '#A6192E',
        'accent-8': '#51284F',
        'accent-9': '#A192B2',
        'accent-10': '#418FDE',
        'accent-11': '#86C8BC',
        'accent-12': '#286140',
        'accent-13': '#179949',
      },
      height: {
        'front-banner': '161px',
        'mirador-container': '700px',
        'pdfjs-container': '640px',
        'videojs-container': '640px',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-0.5deg)' },
          '50%': { transform: 'rotate(0.5deg)' },
        },
      },
      transitionProperty: {
        height: 'height',
      },
      width: {
        'front-card': '485px',
      },
    },
    fontFamily: {
      serif: ['arnhem', 'Georgia', 'serif'], // Body copy, maybe headlines or subheads
      sans: ['gentona', 'Tahoma', 'sans-serif'], // Body copy, good at small sizes
      titling: ['titling', 'Tahoma'], // "Impact" headlines, all caps
      'titling-medium': ['titling-medium'],
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      borderWidth: ['first', 'last'],
    },
  },
  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/forms')],
};
