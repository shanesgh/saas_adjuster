import { Hono } from 'hono';
import { eq, and, desc } from 'drizzle-orm';
import { createDb, claims, claimNotes, users, companies } from '../db/index';
import { requireAuth } from '../lib/auth';
import { createClaimSchema, updateClaimSchema, updateClaimStatusSchema } from '../lib/validation';

type Bindings = {
  NEON_DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
};

const app = new Hono<{
  Bindings: Bindings;
  Variables: {}; 
}>();

// Get all claims for company
app.get('/', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const db = createDb(c.env.NEON_DATABASE_URL);
  
  // Get user to find company
  const user = await db.select()
    .from(users)
    .where(eq(users.clerkId, auth.sub))
    .limit(1);

  if (!user.length) {
    return c.json({ error: 'User not found' }, 404);
  }

  const companyClaims = await db.select()
    .from(claims)
    .where(eq(claims.companyId, user[0].companyId!))
    .orderBy(desc(claims.createdAt));

  return c.json(companyClaims);
});

// Get single claim with notes
app.get('/:id', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const claimId = c.req.param('id');
  const db = createDb(c.env.NEON_DATABASE_URL);

  const claim = await db.select()
    .from(claims)
    .where(eq(claims.id, claimId))
    .limit(1);

  if (!claim.length) {
    return c.json({ error: 'Claim not found' }, 404);
  }

  // Get current notes for each section
  const notes = await db.select()
    .from(claimNotes)
    .where(and(
      eq(claimNotes.claimId, claimId),
      eq(claimNotes.isCurrent, true)
    ));

  return c.json({
    ...claim[0],
    notes: notes.reduce((acc, note) => {
      acc[note.section] = note.content;
      return acc;
    }, {} as Record<string, string>)
  });
});

// Create new claim
app.post('/', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const body = await c.req.json();
  const data = createClaimSchema.parse(body);

  const db = createDb(c.env.NEON_DATABASE_URL);
  
  // Get user to find company
  const user = await db.select()
    .from(users)
    .where(eq(users.clerkId, auth.sub))
    .limit(1);

  if (!user.length) {
    return c.json({ error: 'User not found' }, 404);
  }

  const newClaim = await db.insert(claims)
    .values({
      ...data,
      companyId: user[0].companyId!,
      createdBy: user[0].id,
    })
    .returning();

  return c.json(newClaim[0], 201);
});

// Update claim
app.put('/:id', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const claimId = c.req.param('id');
  const body = await c.req.json();
  const data = updateClaimSchema.parse(body);

  const db = createDb(c.env.NEON_DATABASE_URL);

  const updatedClaim = await db.update(claims)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(claims.id, claimId))
    .returning();

  if (!updatedClaim.length) {
    return c.json({ error: 'Claim not found' }, 404);
  }

  return c.json(updatedClaim[0]);
});

// Update claim status
app.put('/:id/status', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const claimId = c.req.param('id');
  const body = await c.req.json();
  const data = updateClaimStatusSchema.parse(body);

  const db = createDb(c.env.NEON_DATABASE_URL);

  // Get user to check role
  const user = await db.select()
    .from(users)
    .where(eq(users.clerkId, auth.sub))
    .limit(1);

  if (!user.length) {
    return c.json({ error: 'User not found' }, 404);
  }

  // Only owners can mark as completed
  if (data.status === 'completed' && user[0].role !== 'owner') {
    return c.json({ error: 'Only owners can mark claims as completed' }, 403);
  }

  const updatedClaim = await db.update(claims)
    .set({
      status: data.status,
      cancellationReason: data.status === 'cancelled' ? data.reason : null,
      updatedAt: new Date(),
      completedAt: data.status === 'completed' ? new Date() : null,
    })
    .where(eq(claims.id, claimId))
    .returning();

  if (!updatedClaim.length) {
    return c.json({ error: 'Claim not found' }, 404);
  }

  return c.json(updatedClaim[0]);
});

export default app;