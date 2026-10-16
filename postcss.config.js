/** PostCSS pipeline: Tailwind CSS first, then vendor prefixes. */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
