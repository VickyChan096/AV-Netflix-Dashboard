import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Plain static SPA build for GitHub Pages.
// base: "./" keeps asset URLs relative, so it works whether the site is served
// from a user page (user.github.io) or a project page (user.github.io/repo/).
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    // Resolve the "@/*" alias from tsconfig.json natively (Vite 8+).
    tsconfigPaths: true,
  },
});
