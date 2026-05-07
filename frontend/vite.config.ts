import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            pixi: ["pixi.js"],
            socket: ["socket.io-client"],
            router: ["react-router"],
          },
        },
      },
    },
  define: {
    global: {},
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
