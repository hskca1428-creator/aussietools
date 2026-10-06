# AussieTools v0.1

Practical tools for real Australian decisions. Next.js App Router, TypeScript, Tailwind CSS, a metadata-driven tool registry and browser-only calculations.

## Run locally

Node.js 22+ recommended.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Validation: `npm test`, `npm run typecheck`, `npm run build`.

## Included

- Responsive homepage, navigation, six category pages and searchable directory.
- Live Tradie Job Profit Calculator: consistent GST basis, owner and employee labour, vehicle cost, overhead, target quote and extra-hours scenario.
- Nine clearly marked planned tools, excluded from the sitemap and search indexing.
- Copy/share/reset, formula, source and assumption sections, FAQ, guide, related tools.
- Metadata, canonical URLs, sitemap, robots, WebApplication structured data and provisional privacy/terms/disclaimer pages.
- Suggestions: local download by default. Configure a real feedback endpoint to receive submissions; no fake success state.
- Optional Vercel Analytics and anonymous copy/share events, disabled by default. No calculator numbers are sent.

## Architecture

`src/tools/registry.ts` drives categories, discovery, routes and related tools. `src/calculators/` contains pure calculation engines. `src/data/australia/` contains verified rules, sources and separately labelled planning assumptions. UI lives in `src/components/`.

The blueprint example is illustrative and does not reconcile mathematically. With the supplied inputs plus an explicit $0.80/km assumption, cost is $5,678, profit $2,822, and margin 33.2%. Twelve extra owner hours reduces margin to 24.0%. No hardcoded example results are shown.

## GitHub → Vercel

Create a private GitHub repository named `aussietools`, push this project and import it into Vercel with the Next.js preset. Use a preview first. Set `NEXT_PUBLIC_SITE_URL` to the verified deployment domain; use `https://aussietools.au` once DNS is connected. Vercel installs via the committed lockfile and builds with `npm run build`.

## Before public launch

- Supply the operator identity and contact details and review provisional legal pages.
- Configure a feedback receiver with validation, spam protection and retention policy before enabling online submissions.
- Review privacy before enabling `NEXT_PUBLIC_ENABLE_ANALYTICS=true`.
- Verify domain ownership/DNS, add Google Search Console verification and submit sitemap.
- Run Lighthouse against a production deployment; 90+ is a target, not a measured claim.

Accounts, database, AI, affiliates and paid features are intentionally deferred to later milestones.
