# Today's Debate

Challenge someone. Let the crowd decide.

**Live product:** 1v1 challenges with spectator cheers + comments, plus a daily Main Event for SEO and habit.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js (App Router)
- TypeScript + Tailwind CSS
- Supabase (auth, votes, comments, challenges, reminders)
- Local storage for personal progress

## Environment

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://todaysdebate.app
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=todaysdebate.app
NEXT_PUBLIC_POLAR_CHECKOUT_URL=
NEXT_PUBLIC_ADS_ENABLED=false
```

## Database

Apply SQL in order:

1. `supabase/profiles.sql` (+ votes/comments as needed)
2. `supabase/challenges.sql`
3. `supabase/challenges_security.sql` — tighter RLS, accept RPC, spam caps

Challenges power `/challenge` and `/watch`. Seeded crowd data in `src/data/crowd.ts` keeps the feed + leaderboard alive before real users show up.

## Core loops

- `/challenge` — create invite link, opponent accepts, alternate rounds, crowd cheers
- `/debate/[slug]` — daily Main Event (SEO)
- Share cards + OG images for social spread

## Monetization surfaces

- `/pricing` — Plus via Polar checkout URL env
- `/sponsor` — sponsored day intake
- `/classrooms` — B2B education pilot
- `AdSlot` — enable with `NEXT_PUBLIC_ADS_ENABLED=true`
