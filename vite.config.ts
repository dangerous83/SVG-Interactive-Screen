import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Inline the app's JS + CSS into a single self-contained index.html so it runs
    // by double-click from a USB drive (file://) — browsers block external ES-module
    // fetches over file://, which is why a normal build shows a blank page there.
    // Public assets (video, team photos, logos) stay as separate files next to it.
    viteSingleFile({ removeViteModuleLoader: true }),
  ],
  // Relative base so the app runs from any path (file server, USB drive, subfolder).
  base: './',
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
})
