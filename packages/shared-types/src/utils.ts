import { z } from 'zod';

// Shared zod building blocks. These are zod-first on purpose: DTO schemas need
// the runtime validators, and the domain models consume the inferred types — so
// there is a single source of truth for both IDs and date handling.

// --- Branded ID schemas ------------------------------------------------------
// `.brand()` makes each id nominally distinct, so a JdId can't be passed where
// an ApplicationId is expected. z.infer gives the branded type for domain use.
export const applicationId = z.uuid().brand<'ApplicationId'>();
export const jdId = z.uuid().brand<'JdId'>();
export const cvProfileId = z.uuid().brand<'CvProfileId'>();
export const companyId = z.uuid().brand<'CompanyId'>();
export const contactId = z.uuid().brand<'ContactId'>();
export const reminderId = z.uuid().brand<'ReminderId'>();

export type ApplicationId = z.infer<typeof applicationId>;
export type JdId = z.infer<typeof jdId>;
export type CvProfileId = z.infer<typeof cvProfileId>;
export type CompanyId = z.infer<typeof companyId>;
export type ContactId = z.infer<typeof contactId>;
export type ReminderId = z.infer<typeof reminderId>;

// --- Date handling at the wire boundary --------------------------------------
// On the wire dates are ISO strings; in app code they are real Date objects.
// `isoDate` validates the ISO string then coerces it to a Date, so DTOs parse
// string -> Date inbound and (on the FE) string -> Date on responses.
// Input type: string. Output type: Date.
export const isoDate = z.iso.datetime({ offset: true }).pipe(z.coerce.date());
