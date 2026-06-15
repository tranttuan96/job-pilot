# JobPilot AI Agent Instructions

Welcome, AI Agent! When assisting with JobPilot development, please adhere to the following architecture and conventions.

## 1. Context & Goal

JobPilot is an MVP application for software engineers to track their job applications. The primary goals are stability, fast development speed, and solid AI infrastructure.

## 2. Tech Stack Requirements

- **TypeScript Monorepo:** Enforce type safety across all apps and packages.
- **Frontend (React/Vite):** Use functional components, React Hooks, and TanStack Query for state management. Avoid complex class components.
- **Backend (NestJS):** Follow Clean Architecture principles. Use dependency injection, modules, controllers, and services. Keep business logic decoupled from transport layers.
- **Databases:**
  - **PostgreSQL:** Use for structured, relational data (`Application`, `CVProfile`, `Company`, `Role`, `Contact`, `Reminder`) and vector embeddings (`pgvector`).
  - **MongoDB:** Use for unstructured data like raw JDs and flexible extracted fields.
  - **Redis:** Use for background job processing (BullMQ) and caching.
- **Background Tasks:** Use BullMQ with NestJS for any asynchronous tasks like calling the Gemini API, sending emails, or scheduling reminders.

## 3. Coding Standards

- **Strict Typing:** Avoid `any`. Define proper interfaces/types for all data structures.
- **Linting & Formatting:** The project uses ESLint and Prettier. Ensure all generated code complies with standard TypeScript and React linting rules.
- **Commits:** The project uses Conventional Commits. If generating or proposing commits, use the format: `type(scope): subject`.

## 4. Workflows

- **Validation:** Always verify changes by checking TypeScript compilations and lint rules before concluding a task.
- **Modularity:** When adding a new feature, consider if it belongs in a shared package or a specific app within the monorepo.
