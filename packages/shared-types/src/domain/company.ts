import { z } from 'zod';
import { companyId } from '../utils';
import { timestampsSchema } from '../common';

export const companySize = z.enum([
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5001-10000',
  '10001+',
]);
export type CompanySize = z.infer<typeof companySize>;

export const companyType = z.enum(['product', 'outsourcing', 'other']);
export type CompanyType = z.infer<typeof companyType>;

export const companySchema = z
  .object({
    id: companyId,
    name: z.string(), // company name, required
    website: z.url().optional(), // company website URL, optional
    logo: z.string().optional(), // company logo (URL or storage key), optional
    description: z.string().optional(), // company description, optional
    size: companySize.optional(), // company size, optional
    address: z.string().optional(), // company address, optional
    note: z.string().optional(), // note about company, optional
    type: companyType.optional(),
  })
  .extend(timestampsSchema.shape);

export type Company = z.infer<typeof companySchema>;
