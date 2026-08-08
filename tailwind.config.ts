import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#0a0a0b", lime: "#bcff4a" }, fontFamily: { display: ["var(--font-display)", "sans-serif"] }, boxShadow: { glow: "0 0 70px rgba(188,255,74,.18)" } } }, plugins: [] };
export default config;
