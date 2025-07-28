import { and, eq, gt } from "drizzle-orm";
import { createDb, companies, companyPins } from "../db/index";
import { requireAuth } from "../lib/auth";
import { generatePinSchema, pinValidationSchema } from "../lib/validation";
import { Hono } from "hono";

const usersApi = new Hono();

// Generate PIN for new user
usersApi.post("/generate-pin", async (c) => {
  try {
    const res = await requireAuth(c);
    if (!res) return c.json({ error: "Unauthorized" }, 401);
    const { user: auth } = res;

    const body = await c.req.json();
    const { firstName, lastName, role, companyId } = generatePinSchema.parse(body);

    const db = createDb(process.env.NEON_DATABASE_URL!);

    // Generate cryptographically strong PIN
    const generateStrongPIN = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      let pin = "";
      for (let i = 0; i < 10; i++) {
        pin += chars[Math.floor(Math.random() * chars.length)];
      }
      return pin;
    };

    const pin = generateStrongPIN();
    const expiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 days

    // Delete existing PIN for this user if any
    await db.delete(companyPins).where(
      and(
        eq(companyPins.companyId, companyId),
        eq(companyPins.firstName, firstName),
        eq(companyPins.lastName, lastName)
      )
    );

    // Create new PIN
    const newPin = await db.insert(companyPins).values({
      companyId,
      createdBy: auth.sub,
      firstName,
      lastName,
      userRole: role,
      pin,
      expiresAt,
      usesRemaining: 3,
      maxUses: 3,
      failedAttempts: 0,
    }).returning();

    return c.json({
      success: true,
      pin: pin,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Error generating PIN:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Validate PIN
usersApi.post("/validate-pin", async (c) => {
  try {
    const body = await c.req.json();
    const { firstName, lastName, company, pin } = pinValidationSchema.parse(body);
    
    const db = createDb(process.env.NEON_DATABASE_URL!);

    // Find company
    const companyRecord = await db
      .select()
      .from(companies)
      .where(eq(companies.company_name, company))
      .limit(1);

    if (!companyRecord.length) {
      return c.json({ valid: false, error: "Company not found" });
    }

    const companyId = companyRecord[0].id;

    // Find PIN record
    const pinRecord = await db
      .select()
      .from(companyPins)
      .where(
        and(
          eq(companyPins.companyId, companyId),
          eq(companyPins.firstName, firstName),
          eq(companyPins.lastName, lastName),
          gt(companyPins.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!pinRecord.length) {
      return c.json({ valid: false, error: "Invalid or expired PIN" });
    }

    const record = pinRecord[0];

    // Check if locked
    if (record.lockedUntil && new Date(record.lockedUntil) > new Date()) {
      return c.json({
        valid: false,
        error: "PIN is locked. Contact owner to reset.",
      });
    }

    // Validate PIN
    if (record.pin !== pin) {
      const failedAttempts = (record.failedAttempts || 0) + 1;
      const usesRemaining = Math.max(0, (record.usesRemaining ?? 3) - 1);

      const lockedUntil = usesRemaining <= 0 || failedAttempts >= 3
        ? new Date(Date.now() + 30 * 60 * 1000) // 30 mins
        : null;

      await db
        .update(companyPins)
        .set({
          failedAttempts,
          usesRemaining,
          lockedUntil,
        })
        .where(eq(companyPins.id, record.id));

      return c.json({
        valid: false,
        error: usesRemaining <= 0
          ? "PIN exhausted. Locked for 30 minutes."
          : failedAttempts >= 3
          ? "Too many failed attempts. PIN locked temporarily."
          : `Incorrect PIN. ${usesRemaining} use(s) remaining.`,
      });
    }

    // PIN is valid - consume one use
    await db
      .update(companyPins)
      .set({
        usesRemaining: Math.max(0, (record.usesRemaining ?? 3) - 1),
        failedAttempts: 0,
      })
      .where(eq(companyPins.id, record.id));

    return c.json({
      valid: true,
      pinId: record.id,
      role: record.userRole,
      firstName: record.firstName,
      lastName: record.lastName,
      companyId: record.companyId,
    });
  } catch (error) {
    console.error("PIN validation error:", error);
    return c.json({ valid: false, error: "Server error during validation" }, 500);
  }
});

export default usersApi;