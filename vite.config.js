import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages: precisa do subfolder /got-legends/
  // Netlify / Vercel: serve na raiz, base = '/'
  // Controlado pela variável de ambiente VITE_BASE_URL
  base: process.env.VITE_BASE_URL || '/',
})
