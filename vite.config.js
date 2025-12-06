import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Environment variables with VITE_ prefix will be exposed to client
  // Make sure to never expose sensitive keys or secrets
})
