import { z } from 'zod';
import { contactId, companyId } from '../utils';
import { timestampsSchema } from '../common';

export const contactSchema = z
  .object({
    id: contactId,
    name: z.string(), // required
    email: z.email().optional(), // optional
    phone: z.string().optional(), // optional
    role: z.string().optional(), // e.g. recruiter, HR, hiring manager, referrer
    linkedinUrl: z.url().optional(), // optional
    companyId: companyId.optional(), // optional — may be an independent recruiter
    note: z.string().optional(), // optional
  })
  .extend(timestampsSchema.shape);

export type Contact = z.infer<typeof contactSchema>;
