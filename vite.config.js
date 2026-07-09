import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Split React into its own chunk: app updates no longer invalidate the React cache
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'vendor-react';
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173
  },
  preview: {
    host: true,
    port: 4173
  }
})
