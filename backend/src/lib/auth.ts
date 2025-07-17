import { createClerkClient } from '@clerk/backend';
import { Context } from 'hono';

type Bindings = {
  NEON_DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
};

export function createAuth(secretKey: string) {
  return createClerkClient({ secretKey });
}

export async function getAuthUser(c: Context<{ Bindings: Bindings }>) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const clerk = createAuth(c.env.CLERK_SECRET_KEY);
  
  try {
    const session = await clerk.verifyToken(token);
    return session;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function requireAuth(c: Context<{ Bindings: Bindings }>) {
  const user = await getAuthUser(c);
  if (!user) {
    return null;
  }
  return user;
}