import { and, eq, gt } from "drizzle-orm";
import { createDb, users, companies, companyPins } from "../db/index";
import { requireAuth } from "../lib/auth";
import { createUserSchema, pinValidationSchema } from "../lib/validation";
import { Hono } from "hono";

type Bindings = {
  NEON_DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  ASSETS: Fetcher;
};
const usersApi = new Hono<{
  Bindings: Bindings;
  Variables: {};
}>();

usersApi.get("/profile", async (c) => {
  try {
    const res = await requireAuth(c);
    if (!res) return c.json({ error: "Unauthorized" }, 401);
    const { user: auth } = res;

    const db = createDb(c.env.NEON_DATABASE_URL);

    const user = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role,
        company: companies.company_name,
        companyId: users.companyId,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .leftJoin(companies, eq(users.companyId, companies.id))
      .where(eq(users.clerkId, auth.sub))
      .limit(1);

    if (!user.length) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user[0]);
  } catch (error) {
    console.error("Error in /profile:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

usersApi.post("/", async (c) => {
  try {
    const res = await requireAuth(c);
    if (!res) return c.json({ error: "Unauthorized" }, 401);
    const { user: auth } = res;

    const body = await c.req.json();
    const data = createUserSchema.parse(body);

    const db = createDb(c.env.NEON_DATABASE_URL);

    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, auth.sub))
      .limit(1);

    if (!currentUser.length || currentUser[0].role !== "owner") {
      return c.json({ error: "Only owners can create users" }, 403);
    }

    const newUser = await db
      .insert(users)
      .values({
        ...data,
        clerkId: null,
      })
      .returning();

    return c.json(newUser[0], 201);
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

usersApi.post("/generate-pin", async (c) => {
  try {
    const res = await requireAuth(c);
    console.log(res, "Res");
    if (!res) return c.json({ error: "Unauthorized" }, 401);
    const { user: auth } = res;

    const body = await c.req.json();
    const { userId, firstName, lastName, role } = body;

    if (!userId) {
      return c.json({ error: "userId is required" }, 400);
    }
    const db = createDb(c.env.NEON_DATABASE_URL);
    const generateMixedCasePIN = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let pin = "";
      for (let i = 0; i < 8; i++) {
        pin += chars[Math.floor(Math.random() * chars.length)];
      }
      return pin;
    };
    // Generate PIN
    const pin = generateMixedCasePIN();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 5); // 5 days expiry

    const pinTable = await db
      .update(companyPins)
      .set({
        pin,
        createdAt: new Date(),
        createdBy: auth.sub,
        firstName,
        lastName,
        userRole: role,
        expiresAt,
        lockedUntil: null,
      })
      .where(eq(users.id, userId))
      .returning();

    if (!pinTable.length) {
      return Response.json({ valid: false, error: "Pin not found" });
    }

    return c.json({
      success: true,
      pin: pin,
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
    const { firstName, lastName, company, pin } =
      pinValidationSchema.parse(body);
    const db = createDb(c.env.NEON_DATABASE_URL);

    // 🔍 Lookup company
    const companyRecord = await db
      .select()
      .from(companies)
      .where(eq(companies.company_name, company))
      .limit(1);

    if (!companyRecord.length) {
      return Response.json({ valid: false, error: "Company not found" });
    }

    const companyId = companyRecord[0].id;

    // 🔍 Pull potential PIN record (no test yet)
    const pinRec = await db
      .select()
      .from(companyPins)
      .where(
        and(
          eq(companyPins.companyId, companyId),
          eq(companyPins.firstName, firstName),
          eq(companyPins.lastName, lastName),
          gt(companyPins.expiresAt, new Date()) // Not expired
        )
      )
      .limit(1);

    if (!pinRec.length) {
      return Response.json({ valid: false, error: "Invalid or expired PIN" });
    }

    const record = pinRec[0];

    // 🔒 Check for lock
    if (record.lockedUntil && new Date(record.lockedUntil) > new Date()) {
      return Response.json({
        valid: false,
        error: "PIN is locked. Ask owner to reset.",
      });
    }

    // 🚫 Now compare the submitted PIN (case-sensitive as-is)
    if (record.pin !== pin) {
      const failedAttempts = (record.failedAttempts || 0) + 1;
      const usesRemaining = Math.max(0, (record.usesRemaining ?? 3) - 1);

      // Lock PIN if usage limit exhausted
      const lockedUntil =
        usesRemaining <= 0
          ? new Date(Date.now() + 30 * 60 * 1000) // 30 mins
          : failedAttempts >= 3
            ? new Date(Date.now() + 30 * 60 * 1000)
            : null;

      await db
        .update(companyPins)
        .set({
          failedAttempts,
          usesRemaining,
          lockedUntil,
        })
        .where(eq(companyPins.id, record.id));

      return Response.json({
        valid: false,
        error:
          usesRemaining <= 0
            ? "PIN exhausted. Locked for 30 minutes."
            : failedAttempts >= 3
              ? "Too many failed attempts. PIN locked temporarily."
              : `Incorrect PIN. ${usesRemaining} use(s) remaining.`,
      });
    }

    // ✅ PIN is valid - reset failure state
    // await db.delete(companyPins).where(eq(companyPins.id, pin));

    return Response.json({
      valid: true,
      pinId: record.id,
      role: record.userRole,
      firstName: record.firstName,
      lastName: record.lastName,
    });
    // companyId: record.companyId,
  } catch (error) {
    console.error("PIN validation error:", error);
    return Response.json(
      { valid: false, error: "Server error during validation" },
      { status: 500 }
    );
  }
});

export default usersApi;
