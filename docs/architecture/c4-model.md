# C4 Model: JobPilot

## 1. Context Diagram

- **Person (Software Engineer):** Interacts with the system to manage the job-hunting pipeline.
- **Software System (JobPilot):** Core system managing applications, matching CVs, and scheduling reminders.
- **External System 1 (Gemini API):** Processes raw text, extracts entities, and generates vector embeddings.
- **External System 2 (Notification Service):** Telegram API / SendGrid for interview/follow-up notifications.

## 2. Container Diagram

- **Web App (React/Vite):** SPA for the Kanban board interface.
- **API Application (NestJS):** Handles business logic and exposes REST APIs.
- **Background Workers (NestJS + BullMQ):** Message queues for async tasks (LLM calls, sending emails).
- **Relational DB (PostgreSQL + pgvector):** Stores tightly coupled relational data and performs vector search.
- **Document DB (MongoDB):** Stores raw JD content with flexible schemas.
- **Cache / Message Broker (Redis):** Queue management for BullMQ and caching AI results.
