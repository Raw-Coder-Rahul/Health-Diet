import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Raise the warning threshold (default is 500 KB)
    chunkSizeWarningLimit: 1000, // in KB
  },
})