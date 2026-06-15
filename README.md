# JobPilot

JobPilot is an AI-powered Job Application Pipeline Manager designed for Software Engineers. It helps track application statuses, intelligently matches CVs with Job Descriptions (JDs), and manages follow-up reminders.

## Problem Statement

Software Engineers spend too much time tracking application statuses, missing follow-ups/interviews, and struggling to tailor their CVs/Cover Letters for specific Job Descriptions (JDs).

## Features (MVP)

1. **Ingest & Match:** Paste a JD -> AI extracts requirements -> calculates match score with user CV -> suggests cover letter.
2. **Pipeline Management:** Kanban board for application tracking.
3. **Smart Follow-up:** Automated reminders for HR follow-ups and interview prep.

## Architecture & Tech Stack

- **Monorepo:** TypeScript (npm workspaces)
- **Backend:** NestJS + BullMQ (for Queues/Cronjobs)
- **Frontend:** React (Vite) + TanStack Query
- **Databases:** PostgreSQL (pgvector) as the Source of Truth, MongoDB for unstructured JD data, Redis for Caching/BullMQ.

## Getting Started

### Prerequisites

- Node.js (v20+)
- PostgreSQL
- MongoDB
- Redis

### Setup

1. Clone the repository
2. Run \`npm install\` to install monorepo dependencies.
3. Database setup: (Add docker-compose in the future)
4. Start development server (To be implemented).

## Conventions

- **Commits:** Conventional Commits enforced by Husky & Commitlint.
- **Linting:** ESLint & Prettier configured for both frontend and backend.
