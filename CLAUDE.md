# Claude Instructions for JobPilot

This file provides specific instructions for Claude (and other LLMs acting in a pair-programmer capacity) when working on the JobPilot repository.

## Project Context

JobPilot is a monolithic TypeScript project (NPM Workspaces) utilizing:

- NestJS (Backend API & Workers)
- React + Vite (Frontend SPA)
- PostgreSQL + MongoDB + Redis (Polyglot Persistence)

## Claude's Directives

1. **Be Concise:** Provide direct, technical answers. Avoid unnecessary pleasantries.
2. **Follow the Architecture:**
   - Put structured relational data in PostgreSQL.
   - Put unstructured/raw data in MongoDB.
   - Use NestJS modules strictly. Do not introduce circular dependencies.
3. **Type Safety:** Always provide fully typed code. Do not use `any` unless absolutely necessary (and if so, explain why).
4. **Testing:** Propose unit tests (Jest for NestJS, Vitest/React Testing Library for React) alongside business logic changes.
5. **Tool Usage:** When operating via CLI or IDE integrations, ensure you run linting (`npm run lint`) and type-checking after significant changes.

## Git & Commit Conventions

We strictly follow Conventional Commits. Use the following prefixes:

- `feat:` for new features.
- `fix:` for bug fixes.
- `docs:` for documentation updates.
- `refactor:` for code refactoring without feature changes.
- `chore:` for tooling, config, or dependency updates.

_When drafting commit messages, always ensure they are descriptive but concise._
