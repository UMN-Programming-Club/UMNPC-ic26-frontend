import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v4': {
        target: 'http://localhost/domjudge',
        changeOrigin: true,
      },
    },
  },
})
