import { Hono } from 'hono';
import { eq, desc, and, gte, lte, sum } from 'drizzle-orm';
import { createDb, invoices, users, companies } from '../db';
import { requireAuth } from '../lib/auth';

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Simple invoice query - NO KV CACHE NEEDED
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

  // Single query gets all invoices for company
  const companyInvoices = await db.select()
    .from(invoices)
    .where(eq(invoices.companyId, user[0].companyId!))
    .orderBy(desc(invoices.createdAt));

  return c.json(companyInvoices);
});

// Complex aggregation query - KV CACHE BENEFICIAL
app.get('/dashboard-stats', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const cacheKey = `invoice-stats-${auth.sub}`;
  
  // Try cache first
  const cached = await c.env.CACHE?.get(cacheKey);
  if (cached) {
    return c.json(JSON.parse(cached));
  }

  const db = createDb(c.env.NEON_DATABASE_URL);
  
  const user = await db.select()
    .from(users)
    .where(eq(users.clerkId, auth.sub))
    .limit(1);

  if (!user.length) {
    return c.json({ error: 'User not found' }, 404);
  }

  // Complex aggregation queries
  const [totalRevenue, pendingInvoices, overdueInvoices] = await Promise.all([
    db.select({ total: sum(invoices.totalAmount) })
      .from(invoices)
      .where(and(
        eq(invoices.companyId, user[0].companyId!),
        eq(invoices.status, 'paid')
      )),
    
    db.select({ count: sum(invoices.totalAmount) })
      .from(invoices)
      .where(and(
        eq(invoices.companyId, user[0].companyId!),
        eq(invoices.status, 'sent')
      )),
    
    db.select({ count: sum(invoices.totalAmount) })
      .from(invoices)
      .where(and(
        eq(invoices.companyId, user[0].companyId!),
        eq(invoices.status, 'overdue')
      ))
  ]);

  const stats = {
    totalRevenue: totalRevenue[0]?.total || 0,
    pendingAmount: pendingInvoices[0]?.count || 0,
    overdueAmount: overdueInvoices[0]?.count || 0,
    lastUpdated: new Date().toISOString()
  };

  // Cache for 5 minutes
  await c.env.CACHE?.put(cacheKey, JSON.stringify(stats), { expirationTtl: 300 });

  return c.json(stats);
});

// Filtered invoice search - NO KV CACHE NEEDED
app.get('/search', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const { status, startDate, endDate, claimId } = c.req.query();
  
  const db = createDb(c.env.NEON_DATABASE_URL);
  
  const user = await db.select()
    .from(users)
    .where(eq(users.clerkId, auth.sub))
    .limit(1);

  if (!user.length) {
    return c.json({ error: 'User not found' }, 404);
  }

  // Build dynamic where conditions
  const conditions = [eq(invoices.companyId, user[0].companyId!)];
  
  if (status) conditions.push(eq(invoices.status, status));
  if (claimId) conditions.push(eq(invoices.claimId, claimId));
  if (startDate) conditions.push(gte(invoices.invoiceDate, new Date(startDate)));
  if (endDate) conditions.push(lte(invoices.invoiceDate, new Date(endDate)));

  // Single query with filters - still fast, no cache needed
  const filteredInvoices = await db.select()
    .from(invoices)
    .where(and(...conditions))
    .orderBy(desc(invoices.invoiceDate));

  return c.json(filteredInvoices);
});

// Create new invoice
app.post('/', async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: 'Unauthorized' }, 401);

  const body = await c.req.json();
  const db = createDb(c.env.NEON_DATABASE_URL);
  
  const user = await db.select()
    .from(users)
    .where(eq(users.clerkId, auth.sub))
    .limit(1);

  if (!user.length) {
    return c.json({ error: 'User not found' }, 404);
  }

  // Generate invoice number
  const invoiceNumber = `INV-${Date.now()}`;

  const newInvoice = await db.insert(invoices)
    .values({
      ...body,
      companyId: user[0].companyId!,
      invoiceNumber,
    })
    .returning();

  // Invalidate cache after creating new invoice
  const cacheKey = `invoice-stats-${auth.sub}`;
  await c.env.CACHE?.delete(cacheKey);

  return c.json(newInvoice[0], 201);
});

export default app;