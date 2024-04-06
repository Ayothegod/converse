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
        "dark-foreground":"#1f2128",
        "dark-bg":"#242731",
        "neutral-gray":"#888888",
      },
      fontFamily:{
        "poppins":["Poppins", "sans-serif"],
        "orbitron": ['Orbitron', "sans-serif"],
        "josefin": ['Josefin Sans', "sans-serif"],
        "courgette": [ 'Courgette', "cursive"],
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
