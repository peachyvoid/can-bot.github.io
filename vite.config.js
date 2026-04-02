import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  worker: {
    format: "es",
  },
  // jsmediatags ships as CJS; tell Vite to pre-bundle it
  optimizeDeps: {
    include: ["jsmediatags"],
  },
});
