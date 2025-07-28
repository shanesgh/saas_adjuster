CREATE TABLE "claim_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"claim_id" uuid,
	"section" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "company_pins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"created_by" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"user_role" varchar(50) NOT NULL,
	"pin" varchar(10) NOT NULL,
	"uses_remaining" integer DEFAULT 3,
	"max_uses" integer DEFAULT 3,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL,
	"locked_until" timestamp,
	"failed_attempts" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"claim_id" uuid,
	"invoice_number" varchar(100) NOT NULL,
	"invoice_date" timestamp NOT NULL,
	"due_date" timestamp,
	"bill_to_name" varchar(255) NOT NULL,
	"bill_to_address" text NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"vat_rate" numeric(5, 2) DEFAULT '12.5',
	"vat_amount" numeric(10, 2) NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"line_items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" varchar(50) DEFAULT 'draft',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
ALTER TABLE "claim_notes" ADD CONSTRAINT "claim_notes_claim_id_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_pins" ADD CONSTRAINT "company_pins_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_claim_id_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "claim_notes_claim_id_idx" ON "claim_notes" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX "company_pins_company_id_idx" ON "company_pins" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "company_pins_expires_at_idx" ON "company_pins" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "company_pins_created_by_idx" ON "company_pins" USING btree ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "company_pins_unique_active" ON "company_pins" USING btree ("company_id","first_name","last_name");--> statement-breakpoint
CREATE INDEX "company_pins_lookup_idx" ON "company_pins" USING btree ("company_id","first_name","last_name","pin");--> statement-breakpoint
CREATE INDEX "invoices_company_id_idx" ON "invoices" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_invoice_number_idx" ON "invoices" USING btree ("invoice_number");