import { eq, desc } from "drizzle-orm";
import { createDb, reports, claims } from "../db/index";
import { requireAuth } from "../lib/auth";
import { generateReportSchema } from "../lib/validation";
import { Hono } from "hono";


const reportsApi = new Hono();
// Get all reports for company
reportsApi.get("/", async (c) => {
  const res = await requireAuth(c);
  if (!res) return c.json({ error: "Unauthorized" }, 401);
  const { user: auth } = res;

  const db = createDb(process.env.NEON_DATABASE_URL!);

  const companyId = auth.companyId;
  if (!companyId) {
    return c.json({ error: "Company not found" }, 404);
  }

  // Get reports with minimal queries - all data in one table
  const companyReports = await db
    .select()
    .from(reports)
    .where(eq(reports.companyId, companyId))
    .orderBy(desc(reports.createdAt));

  return c.json(companyReports);
});

// Generate report from claim
reportsApi.post("/generate/:claimId", async (c) => {
  const res = await requireAuth(c);
  if (!res) return c.json({ error: "Unauthorized" }, 401);
  const { user: auth } = res;

  const claimId = c.req.param("claimId");
  const body = await c.req.json();
  const { pdfData } = generateReportSchema.parse(body);
  
  const db = createDb(process.env.NEON_DATABASE_URL!);

  const companyId = auth.companyId;
  if (!companyId) {
    return c.json({ error: "Company not found" }, 404);
  }

  // Get claim with all data
  const claim = await db
    .select()
    .from(claims)
    .where(eq(claims.id, claimId))
    .limit(1);

  if (!claim.length) {
    return c.json({ error: "Claim not found" }, 404);
  }

  // Generate report number
  const reportNumber = `RPT-${Date.now().toString().slice(-6)}`;

  // Create report with full data snapshot
  const newReport = await db
    .insert(reports)
    .values({
      claimId,
      companyId,
      generatedBy: auth.sub,
      reportNumber,
      reportData: claim[0], // Full claim data snapshot
      pdfData, // Store the PDF data
      pdfFilename: `${reportNumber}.pdf`,
    })
    .returning();

  return c.json(newReport[0], 201);
});

// Download report PDF
reportsApi.get("/:id/download", async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: "Unauthorized" }, 401);

  const reportId = c.req.param("id");
  const db = createDb(process.env.NEON_DATABASE_URL!);

  const report = await db
    .select()
    .from(reports)
    .where(eq(reports.id, reportId))
    .limit(1);

  if (!report.length || !report[0].pdfData) {
    return c.json({ error: "Report not found" }, 404);
  }

  // Convert base64 to buffer
  const pdfBuffer = Buffer.from(report[0].pdfData, 'base64');
  
  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${report[0].pdfFilename || 'report.pdf'}"`,
    },
  });
});
export default reportsApi;
