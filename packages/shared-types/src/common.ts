import { z } from 'zod';
import { isoDate } from './utils';

// Shared value objects & mixins reused across domain models and DTOs.
// zod-first (like utils) so DTO schemas reuse the validators while domain
// models consume the inferred types — one source of truth for both.

// Audit timestamps. Domain entities extend the Timestamps type; DTOs spread
// timestampsSchema.shape.
export const timestampsSchema = z.object({
  createdAt: isoDate,
  updatedAt: isoDate,
});
export type Timestamps = z.infer<typeof timestampsSchema>;

export const currencyCode = z.enum(['VND', 'USD', 'SGD', 'EUR']);
export type CurrencyCode = z.infer<typeof currencyCode>;

export const salaryPeriod = z.enum(['year', 'month', 'hour']);
export type SalaryPeriod = z.infer<typeof salaryPeriod>;

// Structured money so salaries can be sorted, filtered & compared (replaces
// free-form strings). Use min/max for a range, or set both equal for a single
// figure.
export const salarySchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  currency: currencyCode,
  period: salaryPeriod,
});
export type Salary = z.infer<typeof salarySchema>;
