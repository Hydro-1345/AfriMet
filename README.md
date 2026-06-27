# AfriMet

AfriMet is a culturally-aware metabolic health platform for African and diaspora populations. It helps users understand the nutritional and metabolic impact of their meals through AI-assisted food analysis, metabolic insights, and personalized recommendations.

This repository contains the AfriMet MVP web application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

| Layer        | Technology              |
| ------------ | ----------------------- |
| Frontend     | Next.js 15, TypeScript  |
| Styling      | Tailwind CSS            |
| Backend      | Next.js Server Actions  |
| Database     | Supabase (PostgreSQL)   |
| Auth         | Supabase Auth           |
| Storage      | Supabase Storage        |
| AI           | OpenAI (server-side)    |
| Deployment   | Vercel                  |

## Prerequisites

- [Node.js LTS](https://nodejs.org/) (v20 or later recommended)
- [Git](https://git-scm.com/)
- A [Supabase](https://supabase.com/) project
- A [Vercel](https://vercel.com/) account (for deployment)
- An [OpenAI](https://platform.openai.com/) API key (for meal analysis)

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-org/afrimet.git
cd afrimet
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

| Variable                         | Required | Description                          |
| -------------------------------- | -------- | ------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`       | Yes      | Supabase project URL                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Yes      | Supabase anonymous (public) key      |
| `SUPABASE_SERVICE_ROLE_KEY`      | Yes      | Supabase service role key (server only) |
| `NEXT_PUBLIC_SITE_URL`           | Yes      | App URL (`http://localhost:3000` locally) |
| `OPENAI_API_KEY`                 | Yes*     | OpenAI key for meal analysis         |
| `GOOGLE_CLIENT_ID`               | No       | Future Google OAuth                  |
| `GOOGLE_CLIENT_SECRET`           | No       | Future Google OAuth                  |

Find Supabase keys under **Project Settings → API** in the Supabase dashboard.

### 4. Apply database migrations

Run all files in `supabase/migrations/` against your Supabase project (SQL Editor or CLI).

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start development server       |
| `npm run build` | Create production build        |
| `npm run start` | Start production server        |
| `npm run lint`  | Run ESLint                     |

## Project Structure

```
/app              Next.js App Router pages and layouts
/components       Shared UI components
/lib              Utilities, env handling, Supabase clients
/services         Business logic and server actions
/types            Shared TypeScript type definitions
/supabase         Database migrations
/docs             Deployment and project documentation
/project-docs     Product specification documents
/public           Static assets
```

## Deployment

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for the full production deployment guide, including:

- Supabase auth redirect configuration
- Vercel environment variables
- OpenAI setup
- Post-deploy verification checklist

Quick steps:

1. Push to GitHub.
2. Import in Vercel and add environment variables from `.env.example`.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
4. Configure Supabase redirect URLs to match.
5. Apply all Supabase migrations.
6. Deploy.

## Current Status

**MVP v1.0 — Sprints 0–11 complete**

Features: authentication, health profile, meal logging, African food library, AI meal analysis, metabolic scoring, personalized recommendations, analytics dashboard.

## License

Private — Health Tech LAB
