import { eq } from "drizzle-orm";
import { companies, createDb } from "@worker/db/index";
import { createCompanySchema } from "@worker/lib/validation";
import { createAuth } from "@worker/lib/auth";
import { Hono } from "hono";


const companyApi = new Hono();

companyApi.post("/", async (c) => {
  let companyId: string | null = null;
  const db = createDb(process.env.NEON_DATABASE_URL!);

  console.log("🔍 Company route called");
  console.log("CLERK_SECRET_KEY exists:", !!process.env.CLERK_SECRET_KEY);
  console.log("NEON_DATABASE_URL exists:", !!process.env.NEON_DATABASE_URL);

  try {
    // Check if Clerk secret key is available
    if (!process.env.CLERK_SECRET_KEY) {
      console.error("❌ CLERK_SECRET_KEY environment variable is not set");
      return c.json({
        success: false,
        error: "Server configuration error: Missing authentication key",
      }, 500);
    }

    const body = await c.req.json();
    console.log("📨 Received request body:", body);

    // Validate the request data
    const data = createCompanySchema.parse(body);
    console.log("✅ Data validation passed:", data);

    // 🔍 Check if company already exists by email
    const existingCompany = await db
      .select()
      .from(companies)
      .where(eq(companies.email, data.email))
      .limit(1);

    if (existingCompany.length > 0) {
      console.warn("⚠️ Company already exists:", existingCompany[0]);
      return c.json(
        {
          success: false,
          error: "Company already exists",
        },
        409
      );
    }

    companyId = crypto.randomUUID();
    console.log("🆔 Generated company ID:", companyId);

    // 🏢 Insert company record
    await db.insert(companies).values({
      id: companyId,
      name: data.company_name,
      first_name: data.first_name,
      last_name: data.last_name,
      address: data.address ?? "",
      phone: data.phone,
      email: data.email,
      plan: data.plan, // ✅ Store the selected plan
      settings: {},
    });

    console.log("✅ Successfully created company:", data.company_name);

    // 🔐 Update existing Clerk user with privateMetadata
    try {
      const clerkClient = createAuth(process.env.CLERK_SECRET_KEY!);
      console.log("🔐 Updating Clerk user metadata...");

      await clerkClient.users.updateUser(data.userId, {
        privateMetadata: {
          companyId,
          phoneNumber: data.phone,
          plan: data.plan, // ✅ Also store plan in Clerk metadata
          role: "owner", // Set as owner since they're creating the company
        },
      });

      console.log("✅ Updated Clerk user with metadata");
    } catch (clerkError) {
      console.error("❌ Failed to update Clerk metadata:", clerkError);
      console.error("❌ Clerk error details:", clerkError.message);

      // Rollback company creation
      try {
        await db.delete(companies).where(eq(companies.id, companyId));
        console.log("🔄 Rolled back company creation");
      } catch (rollbackError) {
        console.error("❌ Failed to rollback company creation:", rollbackError);
      }

      return c.json(
        {
          success: false,
          error: "Failed to update user metadata",
          details:
            clerkError instanceof Error ? clerkError.message : "Unknown error",
        },
        500
      );
    }

    return c.json(
      {
        success: true,
        companyId,
        message: "Company created successfully",
      },
      201
    );
  } catch (error) {
    console.error("❌ Error creating company:", error);

    // Handle validation errors (Zod errors have a specific structure)
    if (error && typeof error === "object" && "issues" in error) {
      console.error("❌ Validation error:", error);
      return c.json(
        {
          success: false,
          error: "Invalid data provided",
          details: error,
        },
        400
      );
    }
    // Handle database or other errors
    return c.json(
      {
        success: false,
        error: "Failed to create company",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

export default companyApi;
