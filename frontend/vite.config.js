import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://luxe-store.onrender.com', // Your backend URL
        changeOrigin: true,
        secure: false,
        headers: {
          'Origin': 'https://e-commerce-smoky-omega.vercel.app'
        }
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Ensure proper MIME types for JavaScript modules
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})