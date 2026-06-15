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
