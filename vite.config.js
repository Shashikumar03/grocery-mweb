import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { DEFAULT_API_BASE_URL } from "./src/constants/config.js";
import { imageProxyPlugin } from "./vite.imageProxy.js";

const apiProxy = {
  "/auth": { target: DEFAULT_API_BASE_URL, changeOrigin: true, secure: true },
  "/api": { target: DEFAULT_API_BASE_URL, changeOrigin: true, secure: true },
};

export default defineConfig({
  plugins: [react(), imageProxyPlugin()],
  server: {
    host: true,
    port: 5173,
    proxy: apiProxy,
  },
  preview: {
    host: true,
    proxy: apiProxy,
  },
});
