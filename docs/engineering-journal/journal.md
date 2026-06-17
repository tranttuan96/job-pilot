# Engineering Journal: JobPilot

This journal tracks key architectural decisions, development progress, and technical challenges encountered while building JobPilot.

## Entry 1: Initial Bootstrap

**Date:** Monday 15 June 2026

**Summary:**
Initialized the monolithic repository structure for JobPilot. We opted for npm workspaces to manage the backend (NestJS) and frontend (React/Vite) apps within a single repository, ensuring unified tooling and type safety.

**Decisions Made:**

- Enforced strict code quality with ESLint, Prettier, and Husky (commitlint + lint-staged).
- Set up foundational AI context files (`AGENT.md`, `CLAUDE.md`) to guide future autonomous development.
- Confirmed the polyglot persistence strategy (PostgreSQL for core relations/vector search + MongoDB for raw JD storage).

**Next Steps:**

- Scaffold the `apps/backend` using the NestJS CLI.
- Scaffold the `apps/frontend` using Vite + React + TypeScript.
- Set up shared packages for types/interfaces if necessary.

## Entry 2: Shared Domain Model & Type-Safe Contracts (M1)

**Date:** Wednesday 17 June 2026

**Summary:**
Built `packages/shared-types` as the single source of truth shared by backend
and frontend. Modeled the JobPilot domain (Application, Jd/JdRaw, CvProfile,
Company, Contact, Reminder) and added a generic `Result<T,E>` plus a type-safe
API client on the frontend. This is the core of **M1 — TypeScript Mastery**.

**Decisions Made:**

- **zod-first, types inferred (ADR-002).** Started type-first, but to make DTOs
  provably derive from the domain we flipped: schemas are the source of truth,
  types come from `z.infer`. DTOs are projections (`.pick`/`.omit`/`.partial`)
  of the domain schema, so they can't drift.
- **Branded IDs** (`z.uuid().brand<...>()`) for nominal safety — a `JdId` can't
  be passed where an `ApplicationId` is expected.
- **Application as a discriminated union on `status`** + an append-only
  `statusHistory: ApplicationStatusEvent[]`. The union keeps the current stage
  ergonomic; the log preserves full history incl. repeat interview rounds.
  Added terminal states `accepted`/`withdrawn`.
- **Date boundary:** domain resolves to `Date`; the wire carries ISO strings.
  `isoDate = z.iso.datetime().pipe(z.coerce.date())` parses string→Date at the
  DTO boundary. Rule: validate/`.parse()` at boundaries, never cast.
- **Persistence-only fields stay on the backend entity** — the pgvector
  embedding is not in the shared `CvProfile`; the DB model is `CvProfile & infra`.
- **`Result<T,E>` over exceptions** — discriminated union; callers must narrow
  before reading `.value`. The API client returns `Result<T, ApiError>` and
  never throws (network/timeout/http/parse are typed variants).

**Challenges:**

- `exactOptionalPropertyTypes: true` vs zod: zod infers optionals as
  `T | undefined`, which blocks a compile-time "DTO ⊆ hand-written domain" guard
  — resolved by going zod-first (both sides inferred & consistent). Same flag
  also forced omitting `body` from `RequestInit` rather than passing `undefined`.
- zod v4 API shifts (`z.uuid()`, `z.iso.datetime()`, `.extend(shape)`).

**Next Steps:**

- Finish M1: 10 type-challenges (easy→medium) + explain the 2 hardest.
- M3/M4: NestJS modules + persistence; the DB entity implements
  `CvProfile & { embedding }` and validates request bodies with the shared DTOs.
