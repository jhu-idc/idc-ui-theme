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
  theme: {
    extend: {},
    colors: {
      white: '#ffffff',
      blue_spirit: '#68ACE5',
      blue_heritage: '#002D72',
      black: '#31261D',
      secondary_1: '#CF4520',
      secondary_2: '#76232F',
      secondary_3: '#A15A95',
      secondary_4: '#009B77',
      secondary_5: '#0072CE',
      secondary_6: '#F1C400',
      accent_1: '#CBA052',
      accent_2: '#FF9E1B',
      accent_3: '#FF6900',
      accent_4: '#9E5330',
      accent_5: '#4F2C1D',
      accent_6: '#E8927C',
      accent_7: '#A6192E',
      accent_8: '#51284F',
      accent_9: '#A192B2',
      accent_10: '#418FDE',
      accent_11: '#86C8BC',
      accent_12: '#286140',
      accent_13: '#179949',
    },
  },
  variants: {},
  plugins: [],
};
