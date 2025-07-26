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
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  plan: varchar("plan", { length: 100 }),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Users table with PIN implementation
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: varchar("clerk_id", { length: 255 }).unique(),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "cascade",
    }),
    email: varchar("email", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    role: varchar("role", { length: 50 }).notNull(), // 'owner', 'adjuster', 'clerical'

    // PIN system (3 uses, 5 days valid)
    pin: varchar("pin", { length: 10 }),
    pinCreatedAt: timestamp("pin_created_at"),
    pinUsesRemaining: integer("pin_uses_remaining").default(3),
    pinExpiresAt: timestamp("pin_expires_at"),
    pinLockedUntil: timestamp("pin_locked_until"),

    isActive: boolean("is_active").default(true),
    lastLogin: timestamp("last_login"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("users_clerk_id_idx").on(table.clerkId),
    index("users_company_id_idx").on(table.companyId),
    index("users_pin_expires_idx").on(table.pinExpiresAt),
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
    createdBy: uuid("created_by").references(() => users.id),

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

// Notes with versioning - separate table for audit trail
export const claimNotes = pgTable(
  "claim_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    claimId: uuid("claim_id").references(() => claims.id, {
      onDelete: "cascade",
    }),
    userId: uuid("user_id").references(() => users.id),

    // Note content and context
    section: varchar("section", { length: 100 }).notNull(), // 'documents', 'vehicle', 'damage', etc.
    content: text("content").notNull(),

    // Versioning
    version: integer("version").notNull().default(1),
    isCurrent: boolean("is_current").default(true),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("claim_notes_claim_id_idx").on(table.claimId),
    index("claim_notes_current_idx").on(table.claimId, table.isCurrent),
  ]
);

// Documents table
export const claimDocuments = pgTable(
  "claim_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    claimId: uuid("claim_id").references(() => claims.id, {
      onDelete: "cascade",
    }),
    uploadedBy: uuid("uploaded_by").references(() => users.id),

    filename: varchar("filename", { length: 255 }).notNull(),
    originalFilename: varchar("original_filename", { length: 255 }).notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    fileUrl: text("file_url").notNull(),

    // Document metadata
    documentType: varchar("document_type", { length: 100 }), // 'estimate', 'photo', 'statement', etc.
    description: text("description"),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    claimIdIdx: index("claim_documents_claim_id_idx").on(table.claimId),
  })
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
    generatedBy: uuid("generated_by").references(() => users.id),

    // Report metadata
    reportType: varchar("report_type", { length: 50 }).default("assessment"),
    reportNumber: varchar("report_number", { length: 100 }).notNull().unique(),

    // Full data snapshot for historical accuracy (denormalized)
    reportData: jsonb("report_data").notNull(), // Complete claim data at time of generation

    // Generated files
    pdfUrl: text("pdf_url"),
    pdfFilename: varchar("pdf_filename", { length: 255 }),

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

// Invoices table
export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "cascade",
    }),
    claimId: uuid("claim_id").references(() => claims.id),

    // Invoice details
    invoiceNumber: varchar("invoice_number", { length: 100 })
      .notNull()
      .unique(),
    invoiceDate: timestamp("invoice_date").notNull(),
    dueDate: timestamp("due_date"),

    // Billing information (denormalized)
    billToName: varchar("bill_to_name", { length: 255 }).notNull(),
    billToAddress: text("bill_to_address").notNull(),

    // Financial data
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    vatRate: decimal("vat_rate", { precision: 5, scale: 2 }).default("12.5"),
    vatAmount: decimal("vat_amount", { precision: 10, scale: 2 }).notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),

    // Line items as JSONB for flexibility
    lineItems: jsonb("line_items").notNull().default([]),

    // Status
    status: varchar("status", { length: 50 }).default("draft"), // 'draft', 'sent', 'paid', 'overdue', 'cancelled'

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    companyIdIdx: index("invoices_company_id_idx").on(table.companyId),
    invoiceNumberIdx: uniqueIndex("invoices_invoice_number_idx").on(
      table.invoiceNumber
    ),
  })
);

// Audit log for all changes
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tableName: varchar("table_name", { length: 100 }).notNull(),
    recordId: uuid("record_id").notNull(),
    userId: uuid("user_id").references(() => users.id),

    action: varchar("action", { length: 50 }).notNull(), // 'INSERT', 'UPDATE', 'DELETE'
    oldData: jsonb("old_data"),
    newData: jsonb("new_data"),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    recordIdx: index("audit_log_record_idx").on(
      table.tableName,
      table.recordId
    ),
  })
);
export const companyPins = pgTable(
  "company_pins",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // References
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "cascade",
    }),
    createdBy: varchar("created_by", { length: 255 }).notNull(), // Clerk user ID (string) of owner who created the PIN

    // User identification (before they have a Clerk account)
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    userRole: varchar("user_role", { length: 50 }).notNull(), // 'adjuster', 'clerical'

    // PIN details
    pin: varchar("pin", { length: 10 }).notNull(),

    // Usage tracking - simplified since PIN gets deleted after use
    usesRemaining: integer("uses_remaining").default(3),
    maxUses: integer("max_uses").default(3),

    // Time constraints
    createdAt: timestamp("created_at").defaultNow(),
    expiresAt: timestamp("expires_at")
      .notNull()
      .$default(() => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)), // 5 days from now

    // Security
    lockedUntil: timestamp("locked_until"),
    failedAttempts: integer("failed_attempts").default(0),
  },
  (table) => [
    // Indexes for performance
    index("company_pins_company_id_idx").on(table.companyId),
    index("company_pins_expires_at_idx").on(table.expiresAt),
    index("company_pins_created_by_idx").on(table.createdBy),

    // Unique constraint: one active PIN per user per company
    uniqueIndex("company_pins_unique_active").on(
      table.companyId,
      table.firstName,
      table.lastName
    ),

    // Composite index for PIN validation queries
    index("company_pins_lookup_idx").on(
      table.companyId,
      table.firstName,
      table.lastName,
      table.pin
    ),
  ]
);

// Relations - Only company relation needed since users are in Clerk
export const companyPinsRelations = relations(companyPins, ({ one }) => ({
  company: one(companies, {
    fields: [companyPins.companyId],
    references: [companies.id],
  }),
}));

// No users table relations needed since all users are stored in Clerk
// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  users: many(users),
  claims: many(claims),
  reports: many(reports),
  invoices: many(invoices),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
  claims: many(claims),
  notes: many(claimNotes),
  documents: many(claimDocuments),
  reports: many(reports),
}));

export const claimsRelations = relations(claims, ({ one, many }) => ({
  company: one(companies, {
    fields: [claims.companyId],
    references: [companies.id],
  }),
  createdBy: one(users, {
    fields: [claims.createdBy],
    references: [users.id],
  }),
  notes: many(claimNotes),
  documents: many(claimDocuments),
  reports: many(reports),
}));

export const claimNotesRelations = relations(claimNotes, ({ one }) => ({
  claim: one(claims, {
    fields: [claimNotes.claimId],
    references: [claims.id],
  }),
  user: one(users, {
    fields: [claimNotes.userId],
    references: [users.id],
  }),
}));
