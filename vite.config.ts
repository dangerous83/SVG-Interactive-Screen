import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative base so the built app can run from any path (file server, kiosk, subfolder).
  base: './',
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
    // Keep asset inlining low so large brand images stay lazy-loadable files.
    assetsInlineLimit: 4096,
  },
})
