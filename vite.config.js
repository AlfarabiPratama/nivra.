/* eslint-env node */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
const plugins = [react()];
// eslint-disable-next-line no-undef
const isAnalyze = process.env.ANALYZE === "true";

if (isAnalyze) {
  plugins.push(
    visualizer({
      filename: "dist/stats.html",
      template: "treemap",
      gzipSize: true,
      brotliSize: true,
      open: false,
    })
  );
}

export default defineConfig({
  plugins,
  server: {
    hmr: {
      overlay: true,
      // Use polling as fallback if WebSocket fails
      protocol: "ws",
      host: "localhost",
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  // Environment variables with VITE_ prefix will be exposed to client
  // Make sure to never expose sensitive keys or secrets
});
