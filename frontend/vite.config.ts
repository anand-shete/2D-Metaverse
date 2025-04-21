import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
// https://vite.dev/config/
export default defineConfig({
  define: {
    global: {},
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    https: {
      key: fs.readFileSync("./certs/server.key"),
      cert: fs.readFileSync("./certs/server.crt"),
    },
    // host: "0.0.0.0", // Binds the server to all network interfaces
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
