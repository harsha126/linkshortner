import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',   // bind to IPv4 localhost for VS Code port -forwarding
    port: 5173,          // or your chosen port
    strictPort: true     // fail if port is in use
  }
})
