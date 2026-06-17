import { z } from 'zod';
import {
  reminderResponseSchema,
  createReminderSchema,
  updateReminderSchema,
  type CreateReminderDto,
  type UpdateReminderDto,
} from 'shared-types';
import { createApiClient } from './api-client';

// Single shared client instance. VITE_API_URL is injected at build time;
// falls back to the dev proxy path.
const client = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL ?? '/api',
});

// Endpoint layer: thin, typed wrappers. The response schema drives the return
// type, and request bodies are validated with the DTO schema before sending so
// we never ship a malformed payload. Every call resolves to Result<T, ApiError>
// — no try/catch at call sites.
export const remindersApi = {
  list: () => client.request('/reminders', z.array(reminderResponseSchema)),

  get: (id: string) => client.request(`/reminders/${id}`, reminderResponseSchema),

  create: (input: CreateReminderDto) =>
    client.request('/reminders', reminderResponseSchema, {
      method: 'POST',
      body: createReminderSchema.parse(input),
    }),

  update: (id: string, input: UpdateReminderDto) =>
    client.request(`/reminders/${id}`, reminderResponseSchema, {
      method: 'PATCH',
      body: updateReminderSchema.parse(input),
    }),
};
