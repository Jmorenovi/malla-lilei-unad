import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Emular __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Si tu repositorio en GitHub NO se llama "malla-lilei-unad",
// cambia la constante REPO_BASE a `/<nombre-del-repo>/`
const REPO_BASE = "/malla-lilei-unad/";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: REPO_BASE,
});
