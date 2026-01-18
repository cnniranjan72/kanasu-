import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    historyApiFallback: true,
    proxy: {
      "/predict": "http://127.0.0.1:8000",
      "/roadmap": "http://127.0.0.1:8000",
      "/institutions": "http://127.0.0.1:8000",
      "/chat": "http://127.0.0.1:8000",
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
