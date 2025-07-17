import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { createDb, reports, claims, users } from '../db';
import { requireAuth } from '../lib/auth';

const app = new Hono<{ 
  Bindings: CloudflareBindings;
  Variables: {}; 
}>();

// Get all reports for company
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

  // Get reports with minimal queries - all data in one table
  const companyReports = await db.select()
    .from(reports)
    .where(eq(reports.companyId, user[0].companyId!))
    .orderBy(desc(reports.createdAt));

  return c.json(companyReports);
});

// Generate report from claim
app.post('/generate/:claimId', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const claimId = c.req.param('claimId');
  const db = createDb(c.env.NEON_DATABASE_URL);

  // Get user
  const user = await db.select()
    .from(users)
    .where(eq(users.clerkId, auth.sub))
    .limit(1);

  if (!user.length) {
    return c.json({ error: 'User not found' }, 404);
  }

  // Get claim with all data
  const claim = await db.select()
    .from(claims)
    .where(eq(claims.id, claimId))
    .limit(1);

  if (!claim.length) {
    return c.json({ error: 'Claim not found' }, 404);
  }

  // Generate report number
  const reportNumber = `RPT-${Date.now()}`;

  // Create report with full data snapshot
  const newReport = await db.insert(reports)
    .values({
      claimId,
      companyId: user[0].companyId!,
      generatedBy: user[0].id,
      reportNumber,
      reportData: claim[0], // Full claim data snapshot
    })
    .returning();

  return c.json(newReport[0], 201);
});

export default app;