# Product Specification: JobPilot

## 1. Problem & Persona

- **Problem:** Software Engineers spend too much time tracking application statuses, missing follow-ups/interviews, and struggling to tailor their CVs/Cover Letters for specific Job Descriptions (JDs).
- **Persona:** Software Engineer (the developer building this tool).

## 2. MVP Scope (Minimum Viable Product)

The MVP will strictly focus on 3 core use cases, aggressively cutting out complex features (e.g., auto-crawling job boards) to build a robust value stream and AI infrastructure:

1. **Ingest & Match:** Paste JD (link/text) → AI extracts requirements → AI (Gemini) calculates match score with user's CV profile & suggests bullet points/cover letter.
2. **Pipeline Management:** Track application statuses via a drag-and-drop Kanban board.
3. **Smart Follow-up:** Automated reminders (email/Telegram) to follow up with HR or prepare for upcoming interviews.
