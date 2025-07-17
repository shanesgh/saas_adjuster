import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { createDb, users } from '../db';
import { requireAuth } from '../lib/auth';
import { createUserSchema, pinValidationSchema } from '../lib/validation';

const app = new Hono<{ 
  Bindings: CloudflareBindings;
  Variables: {}; 
}>();

// Generate PIN for new user
app.post('/generate-pin', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const body = await c.req.json();
  const { userId } = pinValidationSchema.pick({ userId: true }).parse(body);

  const db = createDb(c.env.NEON_DATABASE_URL);
  
  // Generate 7-character alphanumeric PIN
  const pin = Math.random().toString(36).substring(2, 9).toUpperCase();
  const pinExpiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 days

  await db.update(users)
    .set({
      pin,
      pinCreatedAt: new Date(),
      pinUsesRemaining: 3,
      pinExpiresAt,
      pinLockedUntil: null,
    })
    .where(eq(users.id, userId));

  return c.json({ pin, expiresAt: pinExpiresAt });
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
    return c.json({ valid: false, error: 'User not found' }, 404);
  }

  const userRecord = user[0];

  // Check if PIN is locked
  if (userRecord.pinLockedUntil && userRecord.pinLockedUntil > new Date()) {
    return c.json({ valid: false, error: 'PIN is locked' }, 423);
  }

  // Check if PIN is expired
  if (!userRecord.pinExpiresAt || userRecord.pinExpiresAt < new Date()) {
    return c.json({ valid: false, error: 'PIN has expired' }, 410);
  }

  // Check if PIN has uses remaining
  if (!userRecord.pinUsesRemaining || userRecord.pinUsesRemaining <= 0) {
    return c.json({ valid: false, error: 'PIN has no uses remaining' }, 410);
  }

  // Check PIN match
  if (userRecord.pin === pin) {
    // Decrement uses
    await db.update(users)
      .set({ pinUsesRemaining: userRecord.pinUsesRemaining - 1 })
      .where(eq(users.id, userId));

    return c.json({ valid: true });
  } else {
    // Lock PIN if no uses remaining after this attempt
    if (userRecord.pinUsesRemaining <= 1) {
      const lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      await db.update(users)
        .set({
          pinUsesRemaining: 0,
          pinLockedUntil: lockUntil,
        })
        .where(eq(users.id, userId));
    } else {
      await db.update(users)
        .set({ pinUsesRemaining: userRecord.pinUsesRemaining - 1 })
        .where(eq(users.id, userId));
    }

    return c.json({ valid: false, error: 'Invalid PIN' }, 401);
  }
});

// Get user profile
app.get('/profile', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const db = createDb(c.env.NEON_DATABASE_URL);
  
  const user = await db.select()
    .from(users)
    .where(eq(users.clerkId, auth.sub))
    .limit(1);

  if (!user.length) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(user[0]);
});

export default app;