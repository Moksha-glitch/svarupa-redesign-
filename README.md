# SVARUPA

**Look within.**

Modern reflection. Ancient wisdom.

A quiet space to understand what you're feeling, explore timeless wisdom, and develop practices that help you live more deliberately.

SVARUPA is a reflection and wellbeing companion. It is not a licensed therapist, a diagnostic tool, or a medical product.

## Run locally

```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Sample journey

- Email: `demo@svarupa.app`
- Password: `lookwithin`

Admin CMS: `admin@svarupa.app` / `lookwithin`

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + SQLite locally, Turso (libSQL) on Vercel
- JWT sessions (email/password + optional Google)
- Swappable AI layer (`guided` | `openai` | `anthropic`)

## Environment

Copy `.env.example` to `.env`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | `file:./dev.db` locally, or a `libsql://` Turso URL in production |
| `TURSO_AUTH_TOKEN` | Turso token, only when `DATABASE_URL` is remote |
| `AUTH_SECRET` | Session signing key |
| `AI_PROVIDER` | `guided` (built-in), `openai`, or `anthropic` |
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` | Optional LLM |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google sign-in |

The guided provider is a retrieval-aware conversation engine. It uses verified verses from the database and will not invent scripture. When an LLM key is present, the same retrieved sources are passed in as the only citable material.

## Content authenticity

Seeded scripture uses public-domain translations:

- Bhagavad Gita — Swami Sivananda
- Upanishads — F. Max Müller, *Sacred Books of the East* (1879)
- Yoga Sutras — Swami Vivekananda (1896) and James Haughton Woods (1914)
- Valmiki Ramayana 1.1.1 — Ralph T. H. Griffith (1870–74)

Each verse stores Sanskrit, transliteration, translation, translator, context, citation, and provenance. Commentaries are labelled **Traditional commentary**, **Modern interpretation**, or **AI-generated reflection**.

## Privacy

Journal entries, reflections, and sit sessions are per-user. There are no public journal URLs. `/journal`, `/reflect`, and `/me` send `noindex`. Data export and account deletion live in Settings.
