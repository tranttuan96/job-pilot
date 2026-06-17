# Data Model Definition

The domain model is defined **once** in the `shared-types` workspace package
(`packages/shared-types`) and consumed by both backend (NestJS) and frontend
(React). This is the single source of truth for data structure across the stack.

## Type Strategy (zod-first; types inferred)

| Layer                      | Location                        | Notes                                                                                                            |
| -------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Shared building blocks** | `src/utils.ts`, `src/common.ts` | Branded ID schemas, `isoDate`, `Salary`, `Timestamps`.                                                           |
| **Domain models**          | `src/domain/*`                  | Each entity is a zod schema; its type is `z.infer`'d. Source of truth. Dates resolve to `Date`.                  |
| **API DTOs**               | `src/dto/*`                     | **Projections** of the domain schema via `.pick()`/`.omit()`/`.partial()` — so they can't drift from the domain. |

Everything is zod-first and types are inferred, so there is no FE/BE drift and
DTOs are provably derived from the domain. Rationale & trade-offs: see `ADR-002`.

### Key conventions

- **Branded IDs:** `ApplicationId`, `JdId`, etc. are `z.uuid().brand<...>()` — a
  `JdId` can't be passed where an `ApplicationId` is expected.
- **Dates:** domain models use `Date`. The wire carries ISO strings; `isoDate`
  (`z.iso.datetime().pipe(z.coerce.date())`) parses string → `Date` inbound on
  the backend and on the frontend when responses are `.parse()`d. The DTO layer
  is the parse boundary.
- **Money:** `Salary { min?, max?, currency, period }` (structured, sortable) —
  not free-form strings.
- **Audit fields:** entities extend `Timestamps { createdAt, updatedAt }`.
- **Validation discipline:** validate request bodies on the backend and
  `.parse()` responses on the frontend — never cast `as T`.

## 1. PostgreSQL (Relational & Vector Store)

Source of truth for structured business logic.

- **Application** (Aggregate Root): links a `cvProfileId` + `jdId` (+ optional
  `contactId`). Current stage is a discriminated union on `status`:
  `saved | applied | interview_scheduled | interviewed | offer | accepted |
rejected | withdrawn`. Full pipeline history (incl. repeat interview rounds)
  is kept in an append-only `statusHistory: ApplicationStatusEvent[]`. Carries
  `expectedSalary?`, `source?`.
- **CVProfile**: `name`, `rawText` (extracted from PDF), `fileUrl?`/`fileName?`.
  The pgvector embedding lives **only on the DB entity**, never in the shared
  type or API responses (backend/DB concern — see ADR-002).
- **Company**: name (+ `website?`, `logo?`, `size?`, `type?`, `address?`, …).
- **Jd** (refined): `jobTitle`, `companyId`, `workMode?`, `employmentType?`,
  `seniority?`, `salaryRange?`, `deadline?`, `isActivelyHiring?`. Same `id` as
  the raw JD in MongoDB.
- **Contact**: HR/recruiter/interviewer info; `companyId?` (optional — may be an
  independent recruiter), `linkedinUrl?`.
- **Reminder**: 1-to-N with `Application` (`applicationId`). Has `remindAt`,
  `note?`, and completion tracking (`isDone`, `completedAt?`) for the scheduling
  worker.

## 2. MongoDB (Document Store)

Unstructured/semi-structured data with a flexible schema.

- **JdRaw**: `id` (maps to the Postgres `Jd`), `rawText` (copied/HTML content),
  `sourceUrl?`, and `extractedData?` (skills, years of experience, benefits —
  extracted by the LLM).
