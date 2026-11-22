# AussieTools v0.2

Practical tools for real Australian decisions. Next.js App Router, TypeScript, Tailwind CSS, a metadata-driven tool registry and browser-only calculations.

## Run locally

Node.js 22+ recommended.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Validation: `npm test`, `npm run typecheck`, `npm run build`.

## New in v0.2

- Trade Toolkit at `/business/trade-toolkit`: six accessible tabs for profit, quote, invoice, scope, client email templates and quick calculators.
- Target-margin quote handoff; private profit/cost breakdown is excluded from client documents.
- Browser-only quote/invoice line items, cent-rounded GST and printable A4 document views. Complete documents before export; GST documents require a checksum-valid ABN. Mixed supplies are excluded from the simplified GST mode.
- AWeber signup: the styled native form posts name/email directly to list awlist6979248, form 972346216. The supplied confirmation redirect is retained. No display pixel or third-party script is loaded. Owner must verify sender authentication and the confirmation/welcome/unsubscribe flow.
- Social bios, seven posts, demo script, welcome email and owner setup checklist in `docs/social-email-launch-kit.md`.

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

The existing GitHub repository is `hskca1428-creator/aussietools`, connected to the deployed Vercel project. Push verified changes through this repository. Use a preview first. Set `NEXT_PUBLIC_SITE_URL` to `https://www.aussietools.au`, the primary domain. The apex redirects there, and an apex value is rewritten to www so canonicals, the sitemap and robots.txt stay on one host. Leave it unset in production to use that default. Preview deployments can set their own origin. Vercel installs via the committed lockfile and builds with `npm run build`.

## Before public launch

- Supply the operator identity and contact details and review provisional legal pages.
- Configure a feedback receiver with validation, spam protection and retention policy before enabling online submissions.
- Review privacy before enabling `NEXT_PUBLIC_ENABLE_ANALYTICS=true`.
- Verify domain ownership/DNS, add Google Search Console verification and submit sitemap.
- Run Lighthouse against a production deployment; 90+ is a target, not a measured claim.

Accounts, database, AI, affiliates and paid features are intentionally deferred to later milestones.

## Job Comparison (v0.3)

`/work/job-comparison` compares entered annual take-home pay after annualised work costs and time. Salary/super are shown separately; income tax and HELP are not estimated. Working weeks apply to costs and hours; weekly results divide annual amounts by 52. Figures stay in browser memory; copied summaries omit individual pay/cost figures. The verified Facebook Page is linked in the footer.

## Employee True Cost (v0.4)

`/business/employee-true-cost` budgets permanent full/part-time employment over 52 weeks. Wages include ordinary paid leave once; leave and training reduce productive hours. Editable 2026–27 general SG 12% and annual earnings cap $270,830, leave loading, productive time, annual employer-specific costs and first-year recruitment. No casual/overtime/award compliance model. Official ATO and Fair Work sources are displayed, checked 20 November 2026.

## Employee True Cost (v0.4)

`/business/employee-true-cost` budgets permanent employment using hourly or annual base pay, editable 2026–27 SG settings and annual employer costs. Paid leave reduces productive hours without adding ordinary leave pay twice. Optional scenario B, first-year recruitment, salary/hourly reconciliation and invalid-input handling are tested. Statutory sources are in `src/data/australia/employment.ts`; current defaults were checked 20 November 2026. Casual, overtime and entitlement calculations are outside this version.

## Household Energy Detective (v0.5)

`/home/energy-detective` models a list of appliances using input watts/schedules or annual kWh. Quantity, seasonal operating days and current/what-if usage are editable. One flat cents/kWh rate applies; daily supply stays fixed. Totals include only listed appliances and supply, not a bill prediction. Annual period averages use 365 days. Solar/TOU/demand/gas and replacement costs are not modelled. Government formula sources checked 21 November 2026.

## Caravan Load Planner (v0.6)

`/caravan-camping/caravan-load` adds packing items and water beyond a plate-tare or measured baseline, compares current/what-if quantities against an entered ATM up to 4,500kg, and shows a separate optional planning reserve. It is not towing approval and does not calculate GTM, towball mass, axle/tyre limits or tow-vehicle GVM/GCM. Download and clipboard exports are browser-only. Government sources checked 22 November 2026.
