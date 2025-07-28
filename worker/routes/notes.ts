import { eq } from "drizzle-orm";
import { createDb, claimNotes } from "../db/index";
import { requireAuth } from "../lib/auth";
import { Hono } from "hono";
import { z } from "zod";

const notesApi = new Hono();

const createNoteSchema = z.object({
  claimId: z.string().uuid(),
  section: z.string().min(1),
  content: z.string().min(1),
});

// Create or update note
notesApi.post("/", async (c) => {
  const res = await requireAuth(c);
  if (!res) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json();
  const { claimId, section, content } = createNoteSchema.parse(body);

  const db = createDb(process.env.NEON_DATABASE_URL!);

  // Delete existing note for this section
  await db.delete(claimNotes).where(
    eq(claimNotes.claimId, claimId) && eq(claimNotes.section, section)
  );

  // Create new note
  const note = await db.insert(claimNotes).values({
    claimId,
    section,
    content,
  }).returning();

  return c.json(note[0], 201);
});

// Get notes for claim
notesApi.get("/:claimId", async (c) => {
  const res = await requireAuth(c);
  if (!res) return c.json({ error: "Unauthorized" }, 401);

  const claimId = c.req.param("claimId");
  const db = createDb(process.env.NEON_DATABASE_URL!);

  const notes = await db
    .select()
    .from(claimNotes)
    .where(eq(claimNotes.claimId, claimId));

  return c.json(notes);
});

export default notesApi;