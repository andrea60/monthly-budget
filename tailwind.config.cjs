/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
  
    extend: {
      fontSize: {
        base: "0.875rem"
      }
    },
  },
  plugins:[
    require('daisyui')
  ],
}

