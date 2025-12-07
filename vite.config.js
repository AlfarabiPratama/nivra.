import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
