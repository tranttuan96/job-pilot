# Engineering Journal: Module M0 - Inception & System Specification

## 1. The Feynman Summary (What I Learned)

In Module M0, I focused on the foundations of **System Design** and **Product Specification** [1]. Instead of jumping straight into coding, I learned to think like a Senior Engineer by asking "what to build and why" before asking "how to build it" [3].

Here are the core concepts I mastered:

- **MVP Scoping & Trade-offs:** I learned how to aggressively cut non-essential features (like automated job crawling) to focus purely on the core value stream of the _JobPilot_ application: JD parsing/matching via LLM, Kanban pipeline management, and smart follow-ups [1, 4].
- **Polyglot Persistence:** I understood the architectural trade-off of using two different databases [5, 6]. I chose **PostgreSQL** (with `pgvector`) as the source of truth for structured relational data and vector embeddings, while utilizing **MongoDB** to handle the unpredictable, semi-structured raw HTML/text of Job Descriptions. This prevents relational table bloat while maintaining flexibility.
- **C4 Modeling:** I successfully modeled the system's Context, clearly defining the boundaries between the internal JobPilot system, the User, and external dependencies like the Gemini LLM API and Notification Services [7].
- **Architecture Decision Records (ADR):** I learned the importance of documenting _why_ technical decisions are made (e.g., choosing a TS Monorepo, NestJS, and React) so they can be defended and referenced in the future [1, 7].

## 2. Deliverables Completed

I have successfully met the "Senior Bar" for this module [7] by producing the following artifacts:

- [x] `docs/product-spec.md`: Defined the persona, problem, and MVP scope.
- [x] `docs/architecture/data-model.md`: Outlined entities (Application, CVProfile, JD_Raw, etc.) across Postgres and Mongo.
- [x] `docs/architecture/c4-model.md`: Created Context and Container diagrams.
- [x] `docs/architecture/context-data-flow.md`: Mapped out the step-by-step data flow from job boards to AI extraction and notifications.
- [x] `docs/architecture/ADR-001.md`: Justified the tech stack selection (TS, NestJS, React, Postgres, Mongo).
- [x] **Monorepo Setup:** Initialized the repository skeleton with pnpm, Turborepo, ESLint, Prettier, and conventional commits [1].

## 3. Reflection & Next Steps

By setting up the infrastructure and documenting the system design, I have a clear blueprint to follow. The next step is to dive deep into **Module M1: TypeScript Mastery**, where I will define these domain models strictly using TypeScript (`discriminated unions`, `branded types`, etc.) to ensure that "illegal states are unrepresentable" [8].
