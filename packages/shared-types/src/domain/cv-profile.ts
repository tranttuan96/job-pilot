import { z } from 'zod';
import { cvProfileId } from '../utils';
import { timestampsSchema } from '../common';

export const cvProfileSchema = z
  .object({
    id: cvProfileId,
    name: z.string(), // Example: "CV Frontend 2024"
    rawText: z.string(), // Text extracted from PDF
    fileUrl: z.string().optional(), // stored source PDF (URL or storage key)
    fileName: z.string().optional(), // original uploaded file name
    // Note: the pgvector embedding is intentionally NOT here — it's a
    // backend/DB concern, never sent to the frontend. Keep it on the DB entity.
  })
  .extend(timestampsSchema.shape);

export type CvProfile = z.infer<typeof cvProfileSchema>;
