import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Companies table
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  company_name: varchar("name", { length: 255 }).notNull(),
  first_name: varchar("first_name", { length: 100 }).notNull(),
  last_name: varchar("last_name", { length: 100 }).notNull(),
  address: text("address"),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  plan: varchar("plan", { length: 100 }),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


// Claims table - main entity with embedded data for minimal queries
export const claims = pgTable(
  "claims",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "cascade",
    }),
    createdBy: varchar("created_by", { length: 255 }), // Clerk user ID

    // Claim identifiers
    claimNumber: varchar("claim_number", { length: 100 }).notNull().unique(),
    yourRef: varchar("your_ref", { length: 100 }),
    ourRef: varchar("our_ref", { length: 100 }),
    invoiceNumber: varchar("invoice_number", { length: 100 }),

    // Dates
    dateReceived: timestamp("date_received"),
    dateInspected: timestamp("date_inspected"),
    dateOfLoss: timestamp("date_of_loss"),
    letterDate: timestamp("letter_date"),

    // Insured information (denormalized for performance)
    insuredName: varchar("insured_name", { length: 255 }),
    insuredAddress: text("insured_address"),
    thirdPartyName: varchar("third_party_name", { length: 255 }),
    thirdPartyVehicle: varchar("third_party_vehicle", { length: 255 }),

    // Vehicle information (embedded for single query)
    vehicleData: jsonb("vehicle_data").notNull().default({}),

    // Assessment data
    damageData: jsonb("damage_data").default({}),
    estimateData: jsonb("estimate_data").default({}),
    recommendationData: jsonb("recommendation_data").default({}),

    // Inspection details
    placeOfInspection: varchar("place_of_inspection", { length: 255 }),
    claimsTechnician: varchar("claims_technician", { length: 255 }),
    witness: varchar("witness", { length: 255 }),
    numberOfPhotographs: integer("number_of_photographs").default(0),
    cancellationReason: text("cancellation_reason"),

    // Status and workflow
    status: varchar("status", { length: 50 }).default("pending"), // 'pending', 'review', 'completed', 'cancelled'
    currentStep: varchar("current_step", { length: 50 }).default("documents"),

    // Metadata
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("claims_company_id_idx").on(table.companyId),
    index("claims_status_idx").on(table.status),
    index("claims_created_at_idx").on(table.createdAt),
    uniqueIndex("claims_claim_number_idx").on(table.claimNumber),
  ]
);


// Reports table - generated reports with full data snapshot
export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    claimId: uuid("claim_id").references(() => claims.id, {
      onDelete: "cascade",
    }),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "cascade",
    }),
    generatedBy: varchar("generated_by", { length: 255 }), // Clerk user ID

    // Report metadata
    reportType: varchar("report_type", { length: 50 }).default("assessment"),
    reportNumber: varchar("report_number", { length: 100 }).notNull().unique(),

    // Full data snapshot for historical accuracy (denormalized)
    reportData: jsonb("report_data").notNull(), // Complete claim data at time of generation

    // Generated files
    pdfUrl: text("pdf_url"),
    pdfFilename: varchar("pdf_filename", { length: 255 }),
    pdfData: text("pdf_data"), // Base64 encoded PDF data

    // Status
    status: varchar("status", { length: 50 }).default("generated"), // 'generated', 'sent', 'archived'

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    companyIdIdx: index("reports_company_id_idx").on(table.companyId),
    claimIdIdx: index("reports_claim_id_idx").on(table.claimId),
    reportNumberIdx: uniqueIndex("reports_report_number_idx").on(
      table.reportNumber
    ),
  })
);

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  claims: many(claims),
  reports: many(reports),
}));

export const claimsRelations = relations(claims, ({ one }) => ({
  company: one(companies, {
    fields: [claims.companyId],
    references: [companies.id],
  }),
}));

