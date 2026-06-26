# AfriMet

AfriMet is a culturally-aware metabolic health platform for African and diaspora populations. It helps users understand the nutritional, metabolic, and financial impact of their meals through AI-assisted food analysis and culturally relevant recommendations.

This repository contains the AfriMet web application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

| Layer        | Technology              |
| ------------ | ----------------------- |
| Frontend     | Next.js, TypeScript     |
| Styling      | Tailwind CSS            |
| Backend      | Next.js API Routes      |
| Database     | Supabase (PostgreSQL)   |
| Auth         | Supabase Auth           |
| Storage      | Supabase Storage        |
| Deployment   | Vercel                  |

## Prerequisites

- [Node.js LTS](https://nodejs.org/) (v20 or later recommended)
- [Git](https://git-scm.com/)
- A [Supabase](https://supabase.com/) project (for database, auth, and storage)
- A [Vercel](https://vercel.com/) account (for deployment)

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

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Required for Supabase connectivity:

| Variable                         | Description                          |
| -------------------------------- | ------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase project URL                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase anonymous (public) key      |
| `SUPABASE_SERVICE_ROLE_KEY`      | Supabase service role key (server only) |

Optional until later sprints:

| Variable               | Required from |
| ---------------------- | ------------- |
| `OPENAI_API_KEY`       | Sprint 6      |
| `GOOGLE_CLIENT_ID`     | Sprint 2      |
| `GOOGLE_CLIENT_SECRET` | Sprint 2      |

Find Supabase keys under **Project Settings → API** in the Supabase dashboard.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start development server       |
| `npm run build` | Create production build        |
| `npm run start` | Start production server        |
| `npm run lint`  | Run ESLint                     |

## Project Structure

```
/app          Next.js App Router pages and layouts
/components   Shared UI components
/lib          Utilities, env handling, Supabase clients
/services     Business logic and external service integrations
/hooks        Custom React hooks
/types        Shared TypeScript type definitions
/public       Static assets
/docs         Project documentation
```

## Supabase Client Usage

**Browser (client components):**

```typescript
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const supabase = createBrowserSupabaseClient();
```

**Server (API routes, Server Actions):**

```typescript
import { createServerSupabaseClient } from "@/lib/supabase/server";

const supabase = createServerSupabaseClient();
```

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add all environment variables from `.env.example` in the Vercel project settings.
4. Deploy — Vercel auto-detects Next.js and requires no extra configuration.

## Current Sprint

**Sprint 0 — Infrastructure & Environment** (complete)

Infrastructure foundation only. No product features, authentication, or AI functionality yet. See `Build Plan.docx` in the project root for the full sprint roadmap.

## License

Private — Health Tech LAB
