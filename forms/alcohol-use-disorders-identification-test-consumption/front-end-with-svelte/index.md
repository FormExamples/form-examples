# AUDIT-C — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Alcohol Use Disorders Identification
Test — Consumption (AUDIT-C): a single continuous single-page wizard plus a
clinician dashboard, styled with the Lily Design System (Svelte headless) and
powered by a pure Svelte 5 scoring engine.

- **Wizard** — `/alcohol-use-disorders-identification-test-consumptions/[id]`:
  six sections (context, patient identification, Q1 frequency of drinking, Q2
  typical quantity, Q3 heavy episodic drinking, summary). Live per-item point
  pills and running AUDIT-C score.
- **Dashboard** — `/alcohol-use-disorders-identification-test-consumptions`:
  SVAR DataGrid with the engine-derived AUDIT-C score, risk band, and
  positive-screen flag; filter by care setting and risk band.
- **Report** —
  `/alcohol-use-disorders-identification-test-consumptions/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `auditc-rules.ts`,
`auditc-grader.ts`, `flagged-issues.ts`. Additive: three consumption items each
score its chosen response 0-4; total 0-12. Risk band: lower (0-4), increasing
(5-7), higher (8-10), possible dependence (11-12). A total &ge; 5 is a positive
screen. Tests in `auditc-grader.test.ts` cover the 4/5 positive cut, the band
boundaries (5, 8, 11), the sex-specific female cut of 4, and totals 0 and 12.

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
