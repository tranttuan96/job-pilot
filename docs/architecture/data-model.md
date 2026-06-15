# Data Model Definition

Based on polyglot persistence principles, the system's data is split across two databases:

## 1. PostgreSQL (Relational & Vector Store)

Acts as the Source of Truth for structured business logic.

- **Application** (Aggregate Root): Contains `status` (Enum: Saved, Applied, Interview, Offer, Rejected), applied date, `notes`, `cvProfileId`, `jdId`.
- **CVProfile**: Contains raw CV text, text chunks, and vector embeddings.
- **Company**: Company details.
- **Role**: Job position details.
- **Contact**: HR/Interviewer information.
- **Reminder**: 1-to-N relationship with `Application` for scheduling worker tasks.

## 2. MongoDB (Document Store)

Handles unstructured/semi-structured data with a flexible schema.

- **JD_Raw**: Contains `jdId` (mapping to PostgreSQL), raw content (HTML/Text), and `extracted_fields` (arrays of skills, benefits, etc., extracted by LLM).
