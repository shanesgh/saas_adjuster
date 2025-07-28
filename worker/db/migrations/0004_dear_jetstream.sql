ALTER TABLE "audit_log" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "claim_documents" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "claim_notes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "company_pins" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "invoices" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "audit_log" CASCADE;--> statement-breakpoint
DROP TABLE "claim_documents" CASCADE;--> statement-breakpoint
DROP TABLE "claim_notes" CASCADE;--> statement-breakpoint
DROP TABLE "company_pins" CASCADE;--> statement-breakpoint
DROP TABLE "invoices" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "claims" DROP CONSTRAINT "claims_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT "reports_generated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "claims" ALTER COLUMN "created_by" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "generated_by" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "pdf_data" text;