# ReSPECT — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Recommended Summary Plan for Emergency
Care and Treatment (ReSPECT): a single continuous single-page wizard plus a
clinician dashboard, styled with the Lily Design System (Svelte headless) and
powered by a pure Svelte 5 completeness engine.

ReSPECT is a documentation and completeness instrument, **not** a scored
assessment. The engine grades a plan `complete` or `incomplete`, reports a
completeness percentage, records which of the eight mandatory rules fired, and
raises safety / governance flags. There is no numeric clinical score.

- **Wizard** — `/plans/[id]`: nine sections (personal details, summary of
  relevant health, preferences and what matters, clinical recommendations, CPR
  recommendation, ceilings of treatment, capacity and involvement, clinician
  sign-off, summary). The capacity section is conditional — proxy / consultee
  fields appear only when the person is recorded as lacking capacity. Live
  completeness status on the summary step.
- **Dashboard** — `/plans`: SVAR DataGrid with the engine-derived completeness
  status, completeness percentage, CPR recommendation, and flag count; filter by
  status and CPR recommendation.
- **Report** — `/plans/[id]/report` with a server-generated PDF (`pdfmake`).

## Completeness engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `respect-rules.ts`,
`respect-grader.ts`, `flagged-issues.ts`. Eight mandatory rules (identity,
health summary, preferences, recommendations, CPR, ceilings, capacity,
sign-off); `status` is `complete` only when all eight pass. `completenessPercent`
counts populated mandatory field-slots (the capacity-proxy slot is conditional,
applying only when the person lacks capacity). Six independent flags cover the
safety-critical omissions (missing CPR recommendation, missing capacity
assessment, no signature, DNACPR without discussion, past review date, missing
health summary). Tests in `respect-grader.test.ts`.

## Stack

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Vitest. SVAR DataGrid for the
dashboard. See [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)
for the Lily Svelte headless component contract.

## Commands

```sh
pnpm install
pnpm run check       # svelte-check: 0 errors, 0 warnings
pnpm run build       # production build
pnpm exec vitest run # engine unit tests
```
