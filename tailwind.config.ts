import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
	"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
  	extend: {}
  },
  plugins: [
    heroui(),
	require("tailwindcss-animate")
],
} satisfies Config;
