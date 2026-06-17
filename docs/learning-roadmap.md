# Learning Roadmap — Middle → Senior Engineer

JobPilot is the **capstone project** for a depth-first Middle → Senior learning
roadmap. Every module of the roadmap "adds one layer" to this codebase, so the
features built here are deliberate — each one exercises a specific senior skill.

This doc maps the roadmap (kept in Notion) to concrete JobPilot modules/features
so anyone (human or AI pair) can see **what I'm working on, which module it
belongs to, what I'm learning, and which feature it delivers** in each phase.

## Source of truth

The **Notion roadmap is authoritative** (especially statuses). This file is a
synced snapshot for in-repo context.

- 🚀 [Roadmap: Middle → Senior Engineer (Depth-first)](https://app.notion.com/p/37fef7f64e47816aa1d2e49a66cd81bf)
- 📚 [Lộ trình Senior (theo Module) — module database](https://app.notion.com/p/0766b6823d0f4a53b4d5e1dd2a9a6c45)

## North star

- **Goal:** middle → senior full-stack capability (TypeScript · NestJS ·
  PostgreSQL/MongoDB · React), going **deep** per topic, with **one real
  production project (JobPilot)** as the backbone + portfolio. **System Design
  is priority #1.**
- **Commitment:** ~2h/day, milestone-driven (no hard deadlines) — advance only
  after clearing each module's **Senior Bar**.
- **6 senior pillars:** 1) Architecture & System Design, 2) Technical depth, 3) Code quality & testing, 4) Operations (DevOps/observability), 5) Leadership & communication, 6) Judgment & ownership.
- **Learning principles:** 70% doing / 30% theory · produce an artifact every
  session (code, an ADR, a diagram, a note) · learn by project, not loose topics
  · Feynman (explain it back weekly) · **measure, don't guess** · build in public.

## Current phase → M1: TypeScript Mastery 🔵

> Focus: Code Quality · "make illegal states unrepresentable" · no hidden `any`.
> Deliverable: _Domain JobPilot typed chặt + type-challenges._

| Build JobPilot checklist                      | Status | In-repo                                                                             |
| --------------------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| Strict mode max across the repo               | ✅     | `tsconfig.base.json`                                                                |
| Domain via discriminated unions + branded IDs | ✅     | `packages/shared-types/src/domain/*`, `utils.ts`                                    |
| zod validate + infer types                    | ✅     | zod-first domain + DTO projections (see `ADR-002`)                                  |
| Generic `Result<T,E>` + type-safe API client  | ✅     | `shared-types/src/result.ts`; `apps/frontend/src/lib/{api-client,api-error,api}.ts` |
| 10 type-challenges solved                     | ⬜     | _(Notion deliverable)_                                                              |

## Module → JobPilot mapping

Status legend: ✅ done · 🔵 in progress · ⬜ planned (sync from Notion).

| Module                                                                                                     | Focus                       | What I'm learning                                                                                                                                    | JobPilot feature / module                                                                                                            | Repo area                             | Status |
| ---------------------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- | ------ |
| [M0](https://app.notion.com/p/37fef7f64e4781cab5b6ed0cfb118b4d) — Kickoff & Spec                           | System Design               | Specs, C4, ADRs, trade-offs                                                                                                                          | Product spec, architecture docs                                                                                                      | `docs/`                               | ✅     |
| [M1](https://app.notion.com/p/37fef7f64e4781768953d90fca3eba90) — TypeScript Mastery                       | Code Quality                | Generics, type-level, branded types, discriminated unions, zod↔types                                                                                 | Shared domain model & contracts                                                                                                      | `packages/shared-types`               | 🔵     |
| [M2](https://app.notion.com/p/37fef7f64e4781b79309fd2aa30b1d26) — System Design Foundations ⭐             | System Design               | Architecture, scaling, trade-offs                                                                                                                    | Ingest pipeline & match-scoring design                                                                                               | `docs/architecture`                   | ⬜     |
| [M3](https://app.notion.com/p/37fef7f64e47817e9fd2e6ae0534028e) — Backend & NestJS Depth                   | System Design, Code Quality | DI, providers, modules, DTO validation                                                                                                               | API modules (Application, JD, CVProfile, Company, Contact, Reminder)                                                                 | `apps/backend`                        | ⬜     |
| [M4](https://app.notion.com/p/37fef7f64e47813899b5e9a6d272c76d) — PostgreSQL Deep                          | System Design, Scalability  | Indexes, FTS, window functions, pgvector                                                                                                             | Pipeline tables, funnel analytics, CV↔JD match                                                                                       | `apps/backend` (persistence)          | ⬜     |
| [M5](https://app.notion.com/p/37fef7f64e478138b73bc3b914b3127e) — MongoDB + Polyglot                       | System Design, Scalability  | Data modeling, polyglot persistence                                                                                                                  | Raw JD storage & parsing (`JdRaw`)                                                                                                   | `apps/backend` (Mongo)                | ⬜     |
| [M6](https://app.notion.com/p/37fef7f64e478179b09be9a3bdaf4a95) — Architecture, Clean Code & Testing       | Code Quality                | Clean/Hexagonal, light DDD, SOLID, patterns, TDD red-green-refactor, testcontainers                                                                  | Refactor API to clean arch (domain↔infra split); TDD the CV↔JD match logic; integration (ephemeral PG/Mongo) + e2e                   | `apps/backend` + tests                | ⬜     |
| [M7](https://app.notion.com/p/37fef7f64e4781aeae55ee9dbdcd0bc7) — Async, Messaging & Real-time             | Scalability, System Design  | BullMQ deep (retry/backoff/DLQ, idempotency), outbox, at-least-once, cron, WebSocket + Redis adapter                                                 | JD ingest pipeline (URL/text→queue→fetch/parse→AI extract→store, idempotent+retry+DLQ); follow-up reminders; real-time Kanban        | `apps/backend` (workers/gateway)      | ⬜     |
| [M8](https://app.notion.com/p/380ef7f64e478193b22cc1438988fc3a) — Performance, Caching & Scalability       | Scalability                 | Redis cache-aside/TTL/invalidation/stampede, N+1, k6 load test (p50/p95/p99), profiling                                                              | Cache match score & AI results; load-test match/list → fix → re-measure; kill N+1 in application list                                | `apps/backend`, `docs/perf-report.md` | ⬜     |
| [M9](https://app.notion.com/p/380ef7f64e4781ba930fef791d1f201e) — DevOps, Observability & Security         | Scalability, Code Quality   | Docker multi-stage, GitHub Actions CI/CD, pino/Grafana/OTel/Sentry, OWASP, JWT+refresh, RBAC                                                         | Dockerize full stack (1 command); CI/CD auto-deploy to live URL; logging+Sentry+/metrics+health; auth+RBAC+helmet; `docs/runbook.md` | infra, `.github/`, `apps/backend`     | ⬜     |
| [M10](https://app.notion.com/p/380ef7f64e4781999c24c0bca0639701) — Frontend Depth (React + TS)             | Code Quality                | Component composition, TanStack Query (cache/invalidation/optimistic), memoization/code-split/Suspense/virtualization, RHF+zod, a11y, RTL+Playwright | Kanban (drag-drop, optimistic) + JD viewer + match-score UI; funnel analytics dashboard; RTL + Playwright e2e                        | `apps/frontend`                       | ⬜     |
| [M11](https://app.notion.com/p/380ef7f64e47816885a9ff317ad5f22b) — System Design II + Scaling + Leadership | System Design, Leadership   | Scaling, design docs, mentoring                                                                                                                      | Job-aggregation extension, design docs/blog                                                                                          | `docs/`                               | ⬜     |

JobPilot's MVP (per `docs/product-spec.md`) — Ingest & Match, Pipeline Kanban,
Smart Follow-up — is delivered across M3–M10; M0–M2 lay the design/type
foundation; M11 covers scaling & the aggregation extension.

## How Claude (AI pair) should use this

When I ask to work on something, use this doc to anchor it:

1. **Locate the module.** Identify which roadmap module the task belongs to and
   which senior pillar it builds. Mention it briefly so the learning intent
   stays explicit.
2. **Teach to the Senior Bar, not just "make it work."** Prefer the senior-level
   approach: surface trade-offs, name alternatives, make illegal states
   unrepresentable, and explain the _why_.
3. **Measure, don't guess.** For performance/coverage/size work, capture numbers
   before/after.
4. **Produce an artifact.** Favor leaving behind an ADR, a diagram, or a note —
   not just code. Architecture decisions go in `docs/architecture` as ADRs.
5. **Keep status honest.** Notion is the source of truth; when a module's status
   changes, update the table above to match.
