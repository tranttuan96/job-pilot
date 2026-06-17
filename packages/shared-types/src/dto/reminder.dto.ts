import { z } from 'zod';
import { reminderSchema } from '../domain/reminder';

// Reference DTO module. DTOs are PROJECTIONS of the domain schema via
// .pick()/.omit()/.partial(), so they can't drift from the domain model.
// Mirror this file per resource. Validate request bodies on the backend
// (e.g. nestjs-zod / ZodValidationPipe) and .parse() responses on the frontend.

// --- Create (request body) ---------------------------------------------------
// Only client-supplied fields; server manages id, timestamps, isDone, completedAt.
export const createReminderSchema = reminderSchema.pick({
  applicationId: true,
  remindAt: true,
  note: true,
});
export type CreateReminderDto = z.infer<typeof createReminderSchema>;

// --- Update (PATCH request body) ---------------------------------------------
export const updateReminderSchema = reminderSchema
  .pick({ remindAt: true, note: true, isDone: true, completedAt: true })
  .partial();
export type UpdateReminderDto = z.infer<typeof updateReminderSchema>;

// --- Response ----------------------------------------------------------------
// Full resource = the domain model itself.
export const reminderResponseSchema = reminderSchema;
export type ReminderResponseDto = z.infer<typeof reminderResponseSchema>;
