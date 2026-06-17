import { z } from 'zod';
import { companyId, jdId, isoDate } from '../utils';
import { salarySchema, timestampsSchema } from '../common';

export const extractedSkillSchema = z.object({
  name: z.string(),
  required: z.boolean(),
});
export type ExtractedSkill = z.infer<typeof extractedSkillSchema>;

export const workMode = z.enum(['remote', 'hybrid', 'on-site']);
export type WorkMode = z.infer<typeof workMode>;

export const employmentType = z.enum([
  'full-time',
  'part-time',
  'contract',
  'freelance',
  'internship',
]);
export type EmploymentType = z.infer<typeof employmentType>;

export const seniority = z.enum(['intern', 'junior', 'mid', 'senior', 'lead']);
export type Seniority = z.infer<typeof seniority>;

// JdId should be an uuid-v4 string

// raw jd (save in MongoDB as is, dynamic schema)
export const jdRawSchema = z.object({
  id: jdId,
  companyId: companyId.optional(), // May not exist if copied text
  rawText: z.string(), // Copied text
  sourceUrl: z.url().optional(),
  extractedData: z
    .object({
      skills: z.array(extractedSkillSchema),
      yearsOfExperience: z.number().optional(),
      benefits: z.array(z.string()).optional(),
    })
    .optional(),
  createdAt: isoDate,
});
export type JdRaw = z.infer<typeof jdRawSchema>;

// Refined JD (save in Postgres, based on JdRaw)
export const jdSchema = z
  .object({
    id: jdId, // Primary key, same id as JdRaw
    jobTitle: z.string(), // required for displaying job title on kanban board
    companyId, // foreign key to company table
    location: z.string().optional(), // example: "Hà Nội", "Hồ Chí Minh"
    workMode: workMode.optional(), // static enum for Postgres
    employmentType: employmentType.optional(),
    seniority: seniority.optional(),
    salaryRange: salarySchema.optional(), // advertised salary, if stated on the JD
    isActivelyHiring: z.boolean().optional(), // job status
    deadline: isoDate.optional(), // deadline for application
  })
  .extend(timestampsSchema.shape);

export type Jd = z.infer<typeof jdSchema>;
