import { Hono } from 'hono'

const app = new Hono()

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', name: 'Whiteboard App', timestamp: new Date().toISOString() })
})

export default app


