import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as schema from "./schema";
import "dotenv/config";

// This script applies migrations to your database
async function runMigration() {
  if (!process.env.NEON_DATABASE_URL) {
    console.error("❌ NEON_DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("🔄 Running migrations...");

  const sql = neon(process.env.NEON_DATABASE_URL);
  const db = drizzle(sql, { schema });

  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }

  process.exit(0);
}
