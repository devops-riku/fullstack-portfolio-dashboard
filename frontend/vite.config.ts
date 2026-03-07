import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    host: true,
    port: 5173,

    allowedHosts: [
      "eric.linkerx.dev"
    ],

    proxy: {
      "/api": {
        target: "http://backend:8000", // docker service name
        changeOrigin: true,
        secure: false,
      },
    },

    watch: {
      usePolling: true // fixes docker file watching
    }
  },
})