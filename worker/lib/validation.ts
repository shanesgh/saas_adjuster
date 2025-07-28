import { z } from "zod";

// Claim schemas
export const createClaimSchema = z.object({
  claimNumber: z.string().min(1).max(100),
  yourRef: z.string().optional(),
  ourRef: z.string().optional(),
  insuredName: z.string().optional(),
  vehicleData: z.record(z.any()).default({}),
  damageData: z.record(z.any()).optional(),
  estimateData: z.record(z.any()).optional(),
  recommendationData: z.record(z.any()).optional(),
  dateReceived: z.string().optional().nullable(),
  dateInspected: z.string().optional().nullable(),
  dateOfLoss: z.string().optional().nullable(),
  letterDate: z.string().optional().nullable(),
  placeOfInspection: z.string().optional(),
  claimsTechnician: z.string().optional(),
  witness: z.string().optional(),
  numberOfPhotographs: z.number().optional(),
});

export const updateClaimSchema = z.object({
  yourRef: z.string().optional(),
  ourRef: z.string().optional(),
  insuredName: z.string().optional(),
  vehicleData: z.record(z.any()).optional(),
  damageData: z.record(z.any()).optional(),
  estimateData: z.record(z.any()).optional(),
  recommendationData: z.record(z.any()).optional(),
  status: z.enum(["pending", "review", "completed", "cancelled"]).optional(),
  currentStep: z.string().optional(),
});

// Status update schema
export const updateClaimStatusSchema = z.object({
  status: z.enum(["pending", "review", "cancelled", "completed"]),
  reason: z.string().optional(),
});

export const createCompanySchema = z.object({
  company_name: z.string().min(1),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().min(7).max(20),
  email: z.string().email(),
  plan: z.string().min(1),
  userId: z.string().min(1),
});

export const generateReportSchema = z.object({
  claimId: z.string().uuid(),
  pdfData: z.string().min(1),
});
