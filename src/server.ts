import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const app = new Hono()

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', name: 'Whiteboard App', timestamp: new Date().toISOString() })
})

// Static files when running under Node server
app.use('/js/*', serveStatic({ root: './public' }))
app.use('/css/*', serveStatic({ root: './public' }))
app.use('/assets/*', serveStatic({ root: './public' }))
app.use('/favicon.ico', serveStatic({ path: './public/favicon.ico' }))

// Fallback route serving index.html
app.get('/', (c) => {
  const indexPath = join(process.cwd(), 'public', 'index.html')
  if (existsSync(indexPath)) {
    const html = readFileSync(indexPath, 'utf-8')
    return c.html(html)
  }
  return c.text('Whiteboard application')
})

// Support starting via tsx src/server.ts
const isDirectRun = process.argv[1] && (process.argv[1].endsWith('server.ts') || process.argv[1].endsWith('server.js'))
if (isDirectRun || process.env.NODE_ENV === 'production') {
  const port = Number(process.env.PORT) || 3000
  console.log(`Whiteboard server running on http://localhost:${port}`)
  serve({
    fetch: app.fetch,
    port
  })
}

export default app

