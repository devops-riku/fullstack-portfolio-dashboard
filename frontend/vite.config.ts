import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    // Docker bind mounts don't always emit reliable file-change events, so
    // newly created files (e.g. src/lib/utils.ts) can go unnoticed by the dev
    // server. Polling makes it pick them up reliably.
    watch: {
      usePolling: true,
    },
    // Allow the public Traefik hostname (mirrors ${HOST:-eric.linkerx.dev} in docker-compose.yml)
    allowedHosts: [process.env.HOST || 'eric.linkerx.dev'],
    proxy: {
      '/api': {
        // Inside Docker, the backend is reachable by its Compose service name,
        // not localhost (which would be the frontend container itself).
        target: process.env.VITE_PROXY_TARGET || 'http://backend:8000',
        changeOrigin: true,
      }
    }
  }
})
