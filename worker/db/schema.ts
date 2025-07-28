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

// Company PINs table
export const companyPins = pgTable(
  "company_pins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "cascade",
    }),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    userRole: varchar("user_role", { length: 50 }).notNull(),
    pin: varchar("pin", { length: 10 }).notNull(),
    usesRemaining: integer("uses_remaining").default(3),
    maxUses: integer("max_uses").default(3),
    createdAt: timestamp("created_at").defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
    lockedUntil: timestamp("locked_until"),
    failedAttempts: integer("failed_attempts").default(0),
  },
  (table) => [
    index("company_pins_company_id_idx").on(table.companyId),
    index("company_pins_expires_at_idx").on(table.expiresAt),
    index("company_pins_created_by_idx").on(table.createdBy),
    uniqueIndex("company_pins_unique_active").on(
      table.companyId,
      table.firstName,
      table.lastName
    ),
    index("company_pins_lookup_idx").on(
      table.companyId,
      table.firstName,
      table.lastName,
      table.pin
    ),
  ]
);

// Claim Notes table
export const claimNotes = pgTable(
  "claim_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    claimId: uuid("claim_id").references(() => claims.id, {
      onDelete: "cascade",
    }),
    section: varchar("section", { length: 100 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("claim_notes_claim_id_idx").on(table.claimId),
  ]
);

// Invoices table
export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "cascade",
    }),
    claimId: uuid("claim_id").references(() => claims.id),
    invoiceNumber: varchar("invoice_number", { length: 100 }).notNull().unique(),
    invoiceDate: timestamp("invoice_date").notNull(),
    dueDate: timestamp("due_date"),
    billToName: varchar("bill_to_name", { length: 255 }).notNull(),
    billToAddress: text("bill_to_address").notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    vatRate: decimal("vat_rate", { precision: 5, scale: 2 }).default("12.5"),
    vatAmount: decimal("vat_amount", { precision: 10, scale: 2 }).notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    lineItems: jsonb("line_items").notNull().default([]),
    status: varchar("status", { length: 50 }).default("draft"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("invoices_company_id_idx").on(table.companyId),
    uniqueIndex("invoices_invoice_number_idx").on(table.invoiceNumber),
  ]
);


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
  pins: many(companyPins),
  invoices: many(invoices),
}));

export const claimsRelations = relations(claims, ({ one, many }) => ({
  company: one(companies, {
    fields: [claims.companyId],
    references: [companies.id],
  }),
  notes: many(claimNotes),
}));

export const companyPinsRelations = relations(companyPins, ({ one }) => ({
  company: one(companies, {
    fields: [companyPins.companyId],
    references: [companies.id],
  }),
}));

export const claimNotesRelations = relations(claimNotes, ({ one }) => ({
  claim: one(claims, {
    fields: [claimNotes.claimId],
    references: [claims.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  company: one(companies, {
    fields: [invoices.companyId],
    references: [companies.id],
  }),
  claim: one(claims, {
    fields: [invoices.claimId],
    references: [claims.id],
  }),
}));