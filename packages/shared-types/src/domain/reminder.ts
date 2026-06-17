import { z } from 'zod';
import { reminderId, applicationId, isoDate } from '../utils';
import { timestampsSchema } from '../common';

// zod-first domain model. The schema is the source of truth; the type is
// inferred. DTOs derive from this schema (see dto/reminder.dto.ts).
export const reminderSchema = z
  .object({
    id: reminderId,
    applicationId,
    remindAt: isoDate,
    note: z.string().optional(),
    isDone: z.boolean(), // pending vs handled
    completedAt: isoDate.optional(), // when it was marked done
  })
  .extend(timestampsSchema.shape);

export type Reminder = z.infer<typeof reminderSchema>;
