import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { createDb, users, companies } from '../db/index';
import { requireAuth } from '../lib/auth';
import { createUserSchema, pinValidationSchema } from '../lib/validation';

type Bindings = {
  NEON_DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
};

const app = new Hono<{
  Bindings: Bindings;
  Variables: {}; 
}>();

// Get user profile
app.get('/profile', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const db = createDb(c.env.NEON_DATABASE_URL);
  
  const user = await db.select({
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
    email: users.email,
    role: users.role,
    company: companies.name,
    companyId: users.companyId,
    isActive: users.isActive,
    createdAt: users.createdAt,
  })
  .from(users)
  .leftJoin(companies, eq(users.companyId, companies.id))
  .where(eq(users.clerkId, auth.sub))
  .limit(1);

  if (!user.length) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(user[0]);
});

// Create user
app.post('/', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const body = await c.req.json();
  const data = createUserSchema.parse(body);

  const db = createDb(c.env.NEON_DATABASE_URL);
  
  // Check if user has permission to create users
  const currentUser = await db.select()
    .from(users)
    .where(eq(users.clerkId, auth.sub))
    .limit(1);

  if (!currentUser.length || currentUser[0].role !== 'owner') {
    return c.json({ error: 'Only owners can create users' }, 403);
  }

  const newUser = await db.insert(users)
    .values({
      ...data,
      clerkId: null, // Will be set when user signs up
    })
    .returning();

  return c.json(newUser[0], 201);
});

// Generate PIN for user
app.post('/generate-pin', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const { userId } = await c.req.json();
  
  const db = createDb(c.env.NEON_DATABASE_URL);
  
  // Check if user has permission
  const currentUser = await db.select()
    .from(users)
    .where(eq(users.clerkId, auth.sub))
    .limit(1);

  if (!currentUser.length || currentUser[0].role !== 'owner') {
    return c.json({ error: 'Only owners can generate PINs' }, 403);
  }

  // Generate PIN
  const pin = Math.random().toString(36).substring(2, 9);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 5); // 5 days expiry
  
  const updatedUser = await db.update(users)
    .set({
      pin,
      pinCreatedAt: new Date(),
      pinExpiresAt: expiresAt,
      pinUsesRemaining: 3,
      pinLockedUntil: null,
    })
    .where(eq(users.id, userId))
    .returning();

  if (!updatedUser.length) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({
    pin,
    expiresAt: expiresAt.toISOString(),
  });
});

// Validate PIN
app.post('/validate-pin', async (c) => {
  const body = await c.req.json();
  const { userId, pin } = pinValidationSchema.parse(body);

  const db = createDb(c.env.NEON_DATABASE_URL);
  
  const user = await db.select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user.length) {
    return c.json({ valid: false, error: 'User not found' });
  }

  const userData = user[0];
  
  // Check if PIN is locked
  if (userData.pinLockedUntil && new Date(userData.pinLockedUntil) > new Date()) {
    return c.json({ 
      valid: false, 
      error: 'PIN is locked. Try again later.' 
    });
  }
  
  // Check if PIN is expired
  if (!userData.pinExpiresAt || new Date(userData.pinExpiresAt) < new Date()) {
    return c.json({ 
      valid: false, 
      error: 'PIN has expired. Request a new one.' 
    });
  }
  
  // Check if PIN is correct
  if (userData.pin !== pin) {
    // Decrement uses and potentially lock
    const pinUsesRemaining = (userData.pinUsesRemaining || 3) - 1;
    const pinLockedUntil = pinUsesRemaining <= 0 
      ? new Date(Date.now() + 30 * 60 * 1000) // Lock for 30 minutes
      : null;
      
    await db.update(users)
      .set({
        pinUsesRemaining,
        pinLockedUntil,
      })
      .where(eq(users.id, userId));
      
    return c.json({ 
      valid: false, 
      error: pinUsesRemaining <= 0 
        ? 'Too many failed attempts. PIN is now locked.' 
        : 'Invalid PIN.' 
    });
  }
  
  // PIN is valid - decrement uses
  await db.update(users)
    .set({
      pinUsesRemaining: (userData.pinUsesRemaining || 3) - 1,
    })
    .where(eq(users.id, userId));
  
  return c.json({ valid: true });
});

export default app;