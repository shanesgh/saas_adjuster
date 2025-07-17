import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import usersApi from './api/users';
import claimsApi from './api/claims';
import notesApi from './api/notes';
import reportsApi from './api/reports';

type CloudflareBindings = {
  NEON_DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
};

const app = new Hono<{ 
  Bindings: CloudflareBindings;
  Variables: {}; 
}>();

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount API routes
app.route('/api/users', usersApi);
app.route('/api/claims', claimsApi);
app.route('/api/notes', notesApi);
app.route('/api/reports', reportsApi);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export const onRequest = handle(app);