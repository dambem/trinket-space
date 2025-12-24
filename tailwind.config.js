/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./public/**/*.svg",  "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        ale:  ["var(--font-afacad-sans)"],
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        'custom-mono': ['MonaspaceArgon', 'monospace'],

      },
      typography: {
        quoteless: {
          css: {
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"),require('flowbite/plugin')],
};
