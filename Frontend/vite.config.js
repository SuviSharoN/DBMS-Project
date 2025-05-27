// Frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Keep this if you added it

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Keep this if you added it
  ],
  // --- ADD THIS SERVER SECTION ---
  server: {
    proxy: {
      // String shorthand: requests ending with /api are proxied
      // Example: /api/auth/login -> http://localhost:5000/api/auth/login
      '/api': {
        target: 'http://localhost:5000', // <-- YOUR BACKEND SERVER URL AND PORT
        changeOrigin: true, // Recommended for virtual hosted sites
        // secure: false, // Uncomment if your backend runs on http (not https) locally
        // Optional: rewrite path if your backend doesn't expect /api prefix
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
  // --- END SERVER SECTION ---
})