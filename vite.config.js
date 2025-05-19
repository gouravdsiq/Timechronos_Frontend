import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['a80b-122-170-164-100.ngrok-free.app'], 
    cors: {
      origin: ['https://a80b-122-170-164-100.ngrok-free.app'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },    // allow any hostname
  },
})
