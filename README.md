# Today's Debate

One debate per day. Pick a stance, read both sides, vote on what convinced you, share your grid.

**Live product goals:** SEO topic pages (`/debate/[slug]`), daily habit loop, ads + Plus + sponsored days + classrooms.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js (App Router)
- TypeScript + Tailwind CSS
- Supabase (auth, votes, comments, reminders)
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

## SEO notes

- Canonical motions live at `/debate/[slug]` (not date URLs).
- `/debate/YYYY-MM-DD` permanently redirects to that day's slug.
- `sitemap.xml` + `robots.txt` are generated.
- Topic hubs: `/topics` and `/topics/[category]`.
- Publish cadence ops: `/publish`.

## Content

Debate corpus: `src/data/debates.json` (regenerate drafts via `node scripts/generate-debates.mjs`).

## Monetization surfaces

- `/pricing` — Plus via Polar checkout URL env
- `/sponsor` — sponsored day intake
- `/classrooms` — B2B education pilot
- `AdSlot` — enable with `NEXT_PUBLIC_ADS_ENABLED=true`

## Ops checklist (toward growth)

1. Google Search Console on `NEXT_PUBLIC_SITE_URL`
2. Plausible (or similar) via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
3. Ship ≥1 unique motion/day; measure resolution-query rankings
4. Wire Polar product → `NEXT_PUBLIC_POLAR_CHECKOUT_URL`
