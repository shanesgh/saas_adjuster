import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono<{ 
  Bindings: {
    NEON_DATABASE_URL: string;
    CLERK_SECRET_KEY: string;
  };
  Variables: {}; 
}>();

app.use('*', cors({
  origin: ['http://localhost:5173', 'https://icavs-claims-form.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

export default app;