import { Hono } from 'hono';
import { eq, and, desc, max } from 'drizzle-orm';
import { createDb, claimNotes, users } from '../db';
import { requireAuth } from '../lib/auth';
import { createNoteSchema, updateNoteSchema } from '../lib/validation';

const app = new Hono<{ 
  Bindings: CloudflareBindings;
  Variables: {}; 
}>();

// Get note history for a claim section
app.get('/:claimId/:section/history', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const claimId = c.req.param('claimId');
  const section = c.req.param('section');
  const db = createDb(c.env.NEON_DATABASE_URL);

  const noteHistory = await db.select()
    .from(claimNotes)
    .where(and(
      eq(claimNotes.claimId, claimId),
      eq(claimNotes.section, section)
    ))
    .orderBy(desc(claimNotes.version));

  return c.json(noteHistory);
});

// Create or update note
app.post('/', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const body = await c.req.json();
  const data = createNoteSchema.parse(body);

  const db = createDb(c.env.NEON_DATABASE_URL);
  
  // Get user
  const user = await db.select()
    .from(users)
    .where(eq(users.clerkId, auth.sub))
    .limit(1);

  if (!user.length) {
    return c.json({ error: 'User not found' }, 404);
  }

  // Mark existing notes as not current
  await db.update(claimNotes)
    .set({ isCurrent: false })
    .where(and(
      eq(claimNotes.claimId, data.claimId),
      eq(claimNotes.section, data.section)
    ));

  // Get next version number
  const maxVersionResult = await db.select({ maxVersion: max(claimNotes.version) })
    .from(claimNotes)
    .where(and(
      eq(claimNotes.claimId, data.claimId),
      eq(claimNotes.section, data.section)
    ));

  const nextVersion = (maxVersionResult[0]?.maxVersion || 0) + 1;

  // Create new note version
  const newNote = await db.insert(claimNotes)
    .values({
      ...data,
      userId: user[0].id,
      version: nextVersion,
      isCurrent: true,
    })
    .returning();

  return c.json(newNote[0], 201);
});

export default app;