import { z } from 'zod';

// User schemas
export const createUserSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.enum(['owner', 'adjuster', 'clerical']),
  companyId: z.string().uuid(),
});

export const pinValidationSchema = z.object({
  userId: z.string().uuid(),
  pin: z.string().length(7),
});

// Claim schemas
export const createClaimSchema = z.object({
  claimNumber: z.string().min(1).max(100),
  yourRef: z.string().optional(),
  ourRef: z.string().optional(),
  insuredName: z.string().optional(),
  vehicleData: z.record(z.any()).default({}),
});

export const updateClaimSchema = z.object({
  yourRef: z.string().optional(),
  ourRef: z.string().optional(),
  insuredName: z.string().optional(),
  vehicleData: z.record(z.any()).optional(),
  damageData: z.record(z.any()).optional(),
  estimateData: z.record(z.any()).optional(),
  recommendationData: z.record(z.any()).optional(),
  status: z.enum(['draft', 'in_progress', 'completed', 'archived']).optional(),
  currentStep: z.string().optional(),
});

// Status update schema
export const updateClaimStatusSchema = z.object({
  status: z.enum(['pending', 'review', 'cancelled', 'completed']),
  reason: z.string().optional(),
});

// Notes schemas
export const createNoteSchema = z.object({
  claimId: z.string().uuid(),
  section: z.string().min(1).max(100),
  content: z.string().min(1),
});

export const updateNoteSchema = z.object({
  content: z.string().min(1),
});

// Document schemas
export const createDocumentSchema = z.object({
  claimId: z.string().uuid(),
  filename: z.string().min(1),
  originalFilename: z.string().min(1),
  fileSize: z.number().positive(),
  mimeType: z.string().min(1),
  fileUrl: z.string().url(),
  documentType: z.string().optional(),
  description: z.string().optional(),
});