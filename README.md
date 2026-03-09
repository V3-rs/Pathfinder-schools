# Pathfinder + Demand Intelligence

4-week pilot: bridge student aspirations and campus resources.

## Quick start

```bash
cd career-dreamer
npm install
npm run dev
```

Open **http://localhost:3000** (or 3001 if 3000 is in use). Run from inside the `career-dreamer` folder.

**MVP works without any config** — uses in-memory store. Add Supabase + OpenAI for persistence and embeddings.

## Setup (optional)

1. **Supabase** – Create project, run `supabase/migrations/001_initial_schema.sql` in SQL Editor.
2. Copy `.env.local.example` → `.env.local` and add:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY` (for embeddings)

## Routes

- `/` – Pathfinder intake form
- `/admin` – Demand Intelligence dashboard (submissions + cluster placeholder)
- `POST /api/intake` – Submit dream, get archetype matches
- `GET /api/recommendations/[id]` – Get recommendations for a submission
- `GET /api/admin/submissions` – List all submissions

## Verification

1. **Intake**: Submit dream text → get `submission_id` + archetype matches
2. **Keywords**: "I want to build software" → Tech Innovator archetype
3. **Admin**: Multiple submissions → list + cluster placeholder
