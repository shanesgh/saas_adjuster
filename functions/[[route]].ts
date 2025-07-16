import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

import usersApi from './api/users';
import claimsApi from './api/claims';
import notesApi from './api/notes';
import reportsApi from './api/reports';
import invoicesApi from './api/invoices';

type CloudflareBindings = {
  NEON_DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
  CACHE: KVNamespace;
};

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount API routes
app.route('/api/users', usersApi);
app.route('/api/claims', claimsApi);
app.route('/api/notes', notesApi);
app.route('/api/reports', reportsApi);
app.route('/api/invoices', invoicesApi);

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