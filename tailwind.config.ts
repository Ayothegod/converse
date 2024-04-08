import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors:{
        primary:"#9747ff",
        "light-foreground":"#f5f4f6",
        "light-bg":"#ffffff",
        "light-primary":"#fffffc",
        "dark-foreground":"#1f2128",
        "dark-bg":"#242731",
        "dark-primary":"#2c2f3a",
        "neutral-gray":"#888888",
      },
      fontFamily:{
        "poppins":["Poppins", "sans-serif"],
        "orbitron": ['Orbitron', "sans-serif"],
        "josefin": ['Josefin Sans', "sans-serif"],
        "courgette": [ 'Courgette', "cursive"],

        "light-gray": [ '#f8f9fa', "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd", "#6c757d","#495057", "#343a40", "#212529"],

        "dark-variation": [ '#09090c',
        // perfect
        "#121317", "#1b1c23", "#1f2128", "#2c2f3a",
        // too light
         "#353945","#3e4251", "#474c5c", "#505568"],
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
