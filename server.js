import { serve } from '@hono/node-server';
import { app } from './worker/index';

const port = process.env.PORT || 8888;

console.log(`🚀 Server starting on port ${port}`);

serve({
  fetch: app.fetch,
  port: port,
});

console.log(`✅ Server running at http://localhost:${port}`);