import { z } from 'zod';
import { applicationId, contactId, cvProfileId, jdId, isoDate } from '../utils';
import { salarySchema, timestampsSchema } from '../common';

// --- Current-stage payload ---------------------------------------------------
// Discriminated union: each member carries only the data specific to that
// status. Pipeline history (incl. milestone dates & repeat stages) lives in
// statusHistory on the base, so nothing is lost on transition.

const savedStatus = z.object({ status: z.literal('saved') });
const appliedStatus = z.object({ status: z.literal('applied') });
const interviewScheduledStatus = z.object({
  status: z.literal('interview_scheduled'),
  location: z.string().optional(), // optional: remote interviews use meetingLink only
  meetingLink: z.url().optional(),
});
const interviewedStatus = z.object({
  status: z.literal('interviewed'),
  interviewNote: z.string(), // notes about interview, benefits, etc.
  feedback: z.string().optional(), // my opinion about the interview
});
const offerStatus = z.object({
  status: z.literal('offer'),
  offeredSalary: salarySchema,
  responseDeadline: isoDate,
});
const acceptedStatus = z.object({ status: z.literal('accepted') }); // got the job
const rejectedStatus = z.object({
  status: z.literal('rejected'),
  rejectionReason: z.string(),
});
const withdrawnStatus = z.object({
  status: z.literal('withdrawn'), // I pulled out of the process
  withdrawalReason: z.string().optional(),
});

export const applicationStatusSchema = z.discriminatedUnion('status', [
  savedStatus,
  appliedStatus,
  interviewScheduledStatus,
  interviewedStatus,
  offerStatus,
  acceptedStatus,
  rejectedStatus,
  withdrawnStatus,
]);
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;

// Discriminant string on its own (handy for kanban columns, filters, etc.).
export type ApplicationStatusName = ApplicationStatus['status'];

// One entry per status transition. Reuses the stage payload union, so each
// event carries the data specific to the status it records (an `interviewed`
// event has interviewNote, an `offer` event has offeredSalary, etc.).
export const applicationStatusEventSchema = z.intersection(
  applicationStatusSchema,
  z.object({
    at: isoDate, // when the transition happened
    note: z.string().optional(), // optional context for the transition
  }),
);
export type ApplicationStatusEvent = z.infer<typeof applicationStatusEventSchema>;

// Where the job was found — useful for funnel analytics.
export const applicationSource = z.enum([
  'linkedin',
  'company_website',
  'referral',
  'job_board',
  'recruiter',
  'other',
]);
export type ApplicationSource = z.infer<typeof applicationSource>;

// Base fields shared by every application, regardless of current status.
// Exported so DTOs can derive from it via .pick()/.omit() (the full
// applicationSchema is an intersection and lacks those object helpers).
export const baseApplicationSchema = z
  .object({
    id: applicationId,
    jdId,
    cvProfileId,
    contactId: contactId.optional(),
    expectedSalary: salarySchema.optional(),
    source: applicationSource.optional(),
    // Append-only log, source of truth for the pipeline history. Survives stage
    // transitions and records repeat stages (e.g. multiple interview rounds).
    // Derive milestone dates by finding the relevant event's `at`.
    statusHistory: z.array(applicationStatusEventSchema),
  })
  .extend(timestampsSchema.shape);

export const applicationSchema = z.intersection(baseApplicationSchema, applicationStatusSchema);
export type Application = z.infer<typeof applicationSchema>;
