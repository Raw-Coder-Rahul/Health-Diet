import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase the default 500 KB warning limit
    chunkSizeWarningLimit: 1000, // in KB

    // Optional: split vendor libraries into separate chunks
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          redux: ['react-redux', '@reduxjs/toolkit'],
          mui: ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
})