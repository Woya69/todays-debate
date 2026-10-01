# Growth ops checklist — Today's Debate

## Live URLs

- Production: https://todays-debate.vercel.app
- GitHub: https://github.com/Woya69/todays-debate
- Canonical domain (when DNS ready): https://todaysdebate.app

## Search Console (do once)

1. Open [Google Search Console](https://search.google.com/search-console)
2. Add property `https://todays-debate.vercel.app` (and later `todaysdebate.app`)
3. Verify via DNS or HTML tag
4. Submit sitemap: `https://todays-debate.vercel.app/sitemap.xml`
5. Inspect a few `/debate/[slug]` URLs and request indexing

## Analytics

Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=todays-debate.vercel.app` (or custom domain) in Vercel env, redeploy.

Track weekly:

- Organic sessions to `/debate/*`
- Top resolution queries (Search Console)
- Share / reminder conversions

## Publish cadence

- Target: ≥1 unique motion/day when possible
- Corpus generator: `node scripts/generate-debates.mjs`
- Ops page: `/publish`
- Prefer steelman quality over thin filler

## Monetization wiring

| Stream | Env / action |
|--------|----------------|
| Ads | `NEXT_PUBLIC_ADS_ENABLED=true` + replace AdSlot |
| Plus | Create Polar product → `NEXT_PUBLIC_POLAR_CHECKOUT_URL` |
| Sponsor | Inbox `sponsors@todaysdebate.app` |
| Classrooms | Inbox `classrooms@todaysdebate.app` |

## Ranking KPI

Judge success on **resolution queries** (e.g. "should nuclear be backbone of clean energy"), not brand searches.
