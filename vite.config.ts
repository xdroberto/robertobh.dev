/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Map shared deps to a named chunk so the browser caches them across deploys.
// Vite 8 uses Rolldown, which only accepts the function form of manualChunks.
const chunkGroups: Record<string, string[]> = {
  three: ['three', '@react-three/fiber'],
  motion: ['framer-motion'],
  react: ['react', 'react-dom'],
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return null
          for (const [chunk, deps] of Object.entries(chunkGroups)) {
            if (deps.some((dep) => id.includes(`node_modules/${dep}/`) || id.includes(`node_modules\\${dep}\\`))) {
              return chunk
            }
          }
          return null
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/__tests__/setup.ts'],
  },
})
