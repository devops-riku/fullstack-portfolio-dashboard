import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
    extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
  },

  server: {
    host: true,
    port: 5173,

    allowedHosts: [
      "eric.linkerx.dev"
    ],

    proxy: {
      "/api": {
        target: "http://api:8000", // docker service name
        changeOrigin: true,
        secure: false,
      },
    },

    watch: {
      usePolling: true // fixes docker file watching
    }
  },
})