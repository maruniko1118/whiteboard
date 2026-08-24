import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [cloudflare()],
  server: {
    port: 3000,
    open: false,
    cors: false // Hono 側の CORS と競合しないよう無効化
  }
})


