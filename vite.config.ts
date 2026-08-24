import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/server.ts',
      exclude: [/^\/(css|js|favicon\.ico|.*\.(png|jpg|svg|json|css|js))($|\?.*)/]
    })
  ],
  server: {
    port: 3000,
    open: false
  },
  publicDir: 'public'
})

