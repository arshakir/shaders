import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
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
      colors: {
        // Custom theme colors
        "theme-foreground": "#63718B",
        "theme-background": "#20202a",
        "theme-selection-foreground": "#2C2E3E",
        "theme-selection-background": "#E5E9F0",
        "theme-url": "#B8DEEB",
        "theme-black": "#44495e",
        "theme-black-bright": "#3b3b4d",
        "theme-red": "#EBB9B9",
        "theme-red-bright": "#cc9b9d",
        "theme-green": "#B1DBA4",
        "theme-green-bright": "#A3CCAD",
        "theme-yellow": "#E6DFB8",
        "theme-yellow-bright": "#d1ba97",
        "theme-blue": "#CDDBF9",
        "theme-blue-bright": "#B8C9EA",
        "theme-magenta": "#F6BBE7",
        "theme-magenta-bright": "#b294bb",
        "theme-cyan": "#CDDBF9",
        "theme-cyan-bright": "#95C2D1",
        "theme-white": "#C6D0E9",
        "theme-white-bright": "#63718B",
        "theme-cursor": "#b8dceb",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
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
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
