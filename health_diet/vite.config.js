import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // increase limit to 1 MB
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