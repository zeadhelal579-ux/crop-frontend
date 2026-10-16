/**
 * Vite configuration: React plugin, the "@" alias for src/, the dev-server
 * proxy to the C# backend (REST + SignalR hub) and the Vitest settings.
 */
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: {
    port: 5173,
    proxy: {
      // REST calls go to the ASP.NET Core backend during development.
      "/api": { target: "http://localhost:5000", changeOrigin: true },
      // SignalR negotiates over the same host (WebSocket transport enabled).
      "/hubs": { target: "http://localhost:5000", changeOrigin: true, ws: true },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    css: false,
    setupFiles: ["./src/tests/setup/vitest.setup.js"],
    include: ["src/tests/**/*.test.{js,jsx}"],
  },
});
