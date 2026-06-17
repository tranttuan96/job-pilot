# Engineering Journal: Module M1 - TypeScript Mastery

> Status: **In progress.** Domain modeling + `Result`/API client done; the
> type-challenges practice remains before the Senior Bar is cleared.

## 1. The Feynman Summary (What I Learned)

Module M1 is about going from "I can use TypeScript" to "I use the type system to
make illegal states unrepresentable." Instead of treating types as annotations, I
used them to encode the domain rules so the compiler catches mistakes for me.

Core concepts I practiced on the real JobPilot domain:

- **Discriminated unions + exhaustiveness.** `Application` is a union on `status`
  (`saved | applied | … | accepted | rejected | withdrawn`). I can't read
  `offeredSalary` unless I've narrowed to `status === 'offer'`. The same pattern
  powers `Result<T,E>` (must narrow `ok` before `.value`) and `ApiError` (a
  `never` check makes a forgotten error variant a compile error).
- **Branded types.** IDs are `string & brand`, so a `JdId` is not interchangeable
  with an `ApplicationId` even though both are strings at runtime — nominal
  safety on top of a structural type system.
- **Generics + inference.** `Result<T,E>` and the API client's
  `request<S extends z.ZodType>(…): Result<z.infer<S>, ApiError>` infer the
  success type _from the schema_ rather than annotating it — avoiding the
  input/output mismatch that `z.ZodType<T>` causes with coercion.
- **zod ↔ types as one source of truth.** Schemas are authored once; types are
  `z.infer`'d. DTOs are projections of the domain schema (`.pick`/`.omit`), so
  the wire contract can't drift from the model. Validation lives at the boundary
  ("parse, don't cast"), which also fixes the `Date`-over-JSON problem via a
  coercing `isoDate`.
- **Strictness as a tool, not a chore.** `exactOptionalPropertyTypes` actively
  shaped decisions (it's why the project went zod-first and why the fetch client
  omits an absent body) — strict flags surfaced real design forks, not noise.
- **Errors as values.** Returning `Result` instead of throwing makes failure part
  of the type, so call sites handle it explicitly (`if (isOk(res))`).

## 2. Deliverables

Tracked against the M1 "Build JobPilot" checklist:

- [x] Strict mode maxed across the repo (`tsconfig.base.json`).
- [x] Domain modeled with discriminated unions + branded IDs
      (`packages/shared-types/src/domain/*`, `utils.ts`).
- [x] zod validate + infer types; DTOs as projections (see `ADR-002`).
- [x] Generic `Result<T,E>` (`shared-types/src/result.ts`) + type-safe API
      client (`apps/frontend/src/lib/{api-client,api-error,api}.ts`).
- [ ] 10 type-challenges solved (easy→medium) + explain the 2 hardest.

## 3. Reflection & Next Steps

The shared contract is now the backbone every later module plugs into: the
backend persistence model will be `CvProfile & { embedding }`, NestJS DTOs will
reuse these schemas for request validation, and the frontend already consumes
them with full type safety through the `Result`-based client.

Remaining for M1: the type-challenges, to drill conditional/mapped/template-literal
types directly (the domain work leaned more on unions, generics, and branding).
After that → **M2 (System Design Foundations)** / **M3 (Backend & NestJS depth)**.
