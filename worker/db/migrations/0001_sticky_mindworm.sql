ALTER TABLE "claims" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "claims" ADD COLUMN "cancellation_reason" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "first_name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "last_name" varchar(100) NOT NULL;