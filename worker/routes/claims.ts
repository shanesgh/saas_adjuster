import { eq, desc } from "drizzle-orm";
import { createDb, claims } from "../db/index";
import { requireAuth } from "../lib/auth";
import {
  createClaimSchema,
  updateClaimSchema,
  updateClaimStatusSchema,
} from "../lib/validation";
import { Hono } from "hono";


const claimsApi = new Hono();
// Get all claims for company
claimsApi.get("/", async (c) => {
  const res = await requireAuth(c);
  if (!res) return c.json({ error: "Unauthorized" }, 401);
  const { user: auth } = res;

  const db = createDb(process.env.NEON_DATABASE_URL!);

  const companyId = auth.companyId;
  if (!companyId) {
    return c.json({ error: "Company not found" }, 404);
  }

  const claims = await db
    .select()
    .from(claims)
    .where(eq(claims.companyId, companyId))
    .orderBy(desc(claims.createdAt));

  return c.json(claims);
});

// Get single claim with notes
claimsApi.get("/:id", async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: "Unauthorized" }, 401);

  const claimId = c.req.param("id");
  const db = createDb(process.env.NEON_DATABASE_URL!);

  const claim = await db
    .select()
    .from(claims)
    .where(eq(claims.id, claimId))
    .limit(1);

  if (!claim.length) {
    return c.json({ error: "Claim not found" }, 404);
  }

  return c.json(claim[0]);
});

// Create new claim

claimsApi.post("/", async (c) => {
  const res = await requireAuth(c);
  if (!res) return c.json({ error: "Unauthorized" }, 401);

  const { clerkClient, user: auth } = res;
  const body = await c.req.json();
  const data = createClaimSchema.parse(body);

  const db = createDb(process.env.NEON_DATABASE_URL!);
  const clerkUserId = auth.sub;

  // 🔍 Fetch full user object from Clerk
  const clerkUser = await clerkClient.users.getUser(clerkUserId);
  const companyId = clerkUser.privateMetadata?.companyId as string;

  if (!companyId) {
    console.error("Missing companyId in Clerk privateMetadata");
    return c.json({ error: "Missing companyId" }, 400);
  }

  const insertData: typeof claims.$inferInsert = {
    companyId,
    createdBy: clerkUserId,
    claimNumber: data.claimNumber,
    yourRef: data.yourRef,
    ourRef: data.ourRef,
    dateReceived: data.dateReceived ? new Date(data.dateReceived) : null,
    dateInspected: data.dateInspected ? new Date(data.dateInspected) : null,
    dateOfLoss: data.dateOfLoss ? new Date(data.dateOfLoss) : null,
    letterDate: data.letterDate ? new Date(data.letterDate) : null,
    insuredName: data.insuredName,
    vehicleData: data.vehicleData,
    damageData: data.damageData || {},
    estimateData: data.estimateData || {},
    recommendationData: data.recommendationData || {},
    placeOfInspection: data.placeOfInspection,
    claimsTechnician: data.claimsTechnician,
    witness: data.witness,
    numberOfPhotographs: data.numberOfPhotographs ?? 0,
  };

  try {
    const newClaim = await db.insert(claims).values(insertData).returning();
    console.log("Successfully created claim:", newClaim[0]);
    return c.json(newClaim[0], 201);
  } catch (error) {
    console.error("Error creating claim:", error);
    return c.json({ error: "Failed to create claim", details: error }, 500);
  }
});

// Update claim
claimsApi.put("/:id", async (c) => {
  const auth = await requireAuth(c);
  if (!auth) return c.json({ error: "Unauthorized" }, 401);

  const claimId = c.req.param("id");
  const body = await c.req.json();
  const data = updateClaimSchema.parse(body);

  const db = createDb(process.env.NEON_DATABASE_URL!);

  const updatedClaim = await db
    .update(claims)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(claims.id, claimId))
    .returning();

  if (!updatedClaim.length) {
    return c.json({ error: "Claim not found" }, 404);
  }

  return c.json(updatedClaim[0]);
});

// Update claim status
claimsApi.put("/:id/status", async (c) => {
  const res = await requireAuth(c);
  if (!res) return c.json({ error: "Unauthorized" }, 401);
  const { user: auth } = res;

  const claimId = c.req.param("id");
  const body = await c.req.json();
  const data = updateClaimStatusSchema.parse(body);

  const db = createDb(process.env.NEON_DATABASE_URL!);

  const userRole = auth.role || "owner"; // Get role from Clerk metadata

  // Only owners can mark as completed
  if (data.status === "completed" && userRole !== "owner") {
    return c.json({ error: "Only owners can mark claims as completed" }, 403);
  }

  const updatedClaim = await db
    .update(claims)
    .set({
      status: data.status,
      cancellationReason: data.status === "cancelled" ? data.reason : null,
      updatedAt: new Date(),
      completedAt: data.status === "completed" ? new Date() : null,
    })
    .where(eq(claims.id, claimId))
    .returning();

  if (!updatedClaim.length) {
    return c.json({ error: "Claim not found" }, 404);
  }

  return c.json(updatedClaim[0]);
});

export default claimsApi;
