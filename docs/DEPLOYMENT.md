# AfriMet — Production Deployment Guide

This guide covers deploying the AfriMet MVP to Vercel with Supabase and OpenAI.

---

## Architecture

```
GitHub → Vercel (Next.js) → Supabase (PostgreSQL, Auth, Storage)
                         → OpenAI (meal analysis only)
```

Single codebase. No separate backend deployment.

---

## Prerequisites

- GitHub repository with the AfriMet codebase
- [Supabase](https://supabase.com/) project with all migrations applied
- [Vercel](https://vercel.com/) account
- [OpenAI](https://platform.openai.com/) API key (for meal analysis)

---

## 1. Supabase Setup

### Apply migrations

Run all SQL files in `supabase/migrations/` in order (via Supabase SQL Editor or CLI):

1. `20250626100000_meals.sql`
2. `20250626200000_food_database.sql`
3. `20250626200001_food_seed.sql`
4. `20250626300000_meal_analysis.sql`
5. `20250626400000_metabolic_scoring.sql`
6. `20250626500000_recommendations.sql`

Also apply any earlier profile/auth migrations from your project history.

### Auth redirect URLs

In **Supabase Dashboard → Authentication → URL Configuration**, set:

| Setting | Value |
|---------|-------|
| **Site URL** | `https://your-production-domain.com` |
| **Redirect URLs** | `https://your-production-domain.com/auth/callback` |
| | `https://your-production-domain.com/auth/callback/recovery` |
| | `http://localhost:3000/auth/callback` (for local dev) |
| | `http://localhost:3000/auth/callback/recovery` (for local dev) |

Add preview deployment URLs if using Vercel preview branches:

`https://*.vercel.app/auth/callback`

### Storage

Confirm the `meal-images` bucket exists (created by meals migration) with RLS policies enabled.

### Row Level Security

All user data tables use RLS via meal/profile ownership. Do not disable RLS in production.

---

## 2. Vercel Setup

### Import project

1. Push code to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Framework preset: **Next.js** (auto-detected).
4. Build command: `npm run build`
5. Output: default (`.next`)

### Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** for **Production** (and Preview if desired):

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only service role key |
| `NEXT_PUBLIC_SITE_URL` | Yes | Production URL, e.g. `https://afrimet.vercel.app` |
| `OPENAI_API_KEY` | Yes | OpenAI API key for meal analysis |
| `GOOGLE_CLIENT_ID` | No | Future Google OAuth |
| `GOOGLE_CLIENT_SECRET` | No | Future Google OAuth |

**Important:** `NEXT_PUBLIC_SITE_URL` must match your deployed domain and Supabase Site URL for auth emails and password reset to work.

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `OPENAI_API_KEY` to the client.

### Deploy

Deploy from the Vercel dashboard or by pushing to the connected branch (typically `main`).

---

## 3. OpenAI Setup

1. Create an API key at [platform.openai.com](https://platform.openai.com/).
2. Add `OPENAI_API_KEY` to Vercel environment variables.
3. Set usage limits/billing alerts in the OpenAI dashboard.

Meal analysis uses `gpt-4o-mini` server-side only. No OpenAI calls from the browser.

---

## 4. Post-Deploy Verification

See the manual launch checklist in the Sprint 11 deliverables or run through:

- [ ] Home page loads over HTTPS
- [ ] Register / login / logout
- [ ] Password reset email → update password flow
- [ ] Onboarding → profile completion
- [ ] Log meal (text + image upload)
- [ ] AI meal analysis
- [ ] Metabolic insights + recommendations
- [ ] Dashboard analytics (7d / 30d / all time)
- [ ] Food library search
- [ ] 404 page for invalid routes

---

## 5. Security Notes

- All secrets are server-only (`server-only` package guards AI and env modules).
- Auth callbacks validate redirect paths via `getSafeRedirectPath()`.
- Middleware protects authenticated routes and enforces profile completion.
- `vercel.json` adds security headers (X-Frame-Options, nosniff, etc.).
- Supabase Storage uses per-user folder RLS on `meal-images`.

---

## 6. Troubleshooting

| Issue | Check |
|-------|-------|
| Auth email links go to localhost | Set `NEXT_PUBLIC_SITE_URL` in Vercel and Supabase Site URL |
| Password reset lands on dashboard or login error | Add `/auth/callback/recovery` to Supabase redirect URLs; complete reset in the same browser that requested the link |
| Meal images not loading | Confirm `NEXT_PUBLIC_SUPABASE_URL` matches project; check storage RLS |
| AI analysis fails | Verify `OPENAI_API_KEY` in Vercel; check OpenAI billing/limits |
| 401 on protected routes | Confirm Supabase keys match the same project |

---

## Local development

```bash
cp .env.example .env.local
# Fill in values
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## MVP scope

This deployment covers MVP v1.0 only. Version 2 features (AI coach, family accounts, mobile app) are not included.
