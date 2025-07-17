import { Hono } from 'hono';
import { cors } from 'hono/cors';

import usersApi from './routes/users';
import claimsApi from './routes/claims';
import notesApi from './routes/notes';
import reportsApi from './routes/reports';

type Bindings = {
  NEON_DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
};

const app = new Hono<{ 
  Bindings: Bindings;
  Variables: {}; 
}>();

// CORS middleware
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://icavs-claims-form.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/health', (c) => {
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

export default app;