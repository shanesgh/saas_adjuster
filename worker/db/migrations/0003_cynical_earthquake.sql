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
ALTER TABLE "company_pins" ADD CONSTRAINT "company_pins_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "company_pins_company_id_idx" ON "company_pins" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "company_pins_expires_at_idx" ON "company_pins" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "company_pins_created_by_idx" ON "company_pins" USING btree ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "company_pins_unique_active" ON "company_pins" USING btree ("company_id","first_name","last_name");--> statement-breakpoint
CREATE INDEX "company_pins_lookup_idx" ON "company_pins" USING btree ("company_id","first_name","last_name","pin");