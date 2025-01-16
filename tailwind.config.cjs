/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        base: "0.875rem",
      },
      colors: {
        "success-secondary": "oklch(var(--success-secondary) / <alpha-value>)",
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "--success-secondary": "0.29 0.05 158.78",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "--success-secondary": "0.29 0.05 158.78",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
