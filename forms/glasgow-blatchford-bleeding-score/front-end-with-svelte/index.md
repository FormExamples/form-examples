# Glasgow-Blatchford Bleeding Score — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Glasgow-Blatchford Bleeding Score
(GBS): a single continuous single-page wizard plus a clinician dashboard, styled
with the Lily Design System (Svelte headless) and powered by a pure Svelte 5
scoring engine.

- **Wizard** — `/glasgow-blatchford-bleeding-scores/[id]`: six sections
  (assessment context, patient identification, laboratory markers, haemodynamics,
  clinical markers, summary). Live per-parameter points and a live score / risk
  band readout.
- **Dashboard** — `/glasgow-blatchford-bleeding-scores`: SVAR DataGrid with the
  engine-derived Glasgow-Blatchford score, risk band, and flag count; filter by
  care setting and risk band.
- **Report** — `/glasgow-blatchford-bleeding-scores/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `gbs-rules.ts`, `gbs-grader.ts`,
`flagged-issues.ts`. Weighted additive score: eight admission parameters each
contribute points by band — blood urea (0/2/3/4/6), haemoglobin (sex-specific:
men 0/1/3/6, women 0/1/6), systolic blood pressure (0/1/2/3), pulse (0/1),
melaena (0/1), syncope (0/2), hepatic disease (0/2), cardiac failure (0/2). The
total 0-23 bands into a risk level: 0 → very low, 1-5 → low-moderate, ≥ 6 →
high. A missing numeric input contributes 0 points and, together with unknown
sex, raises a data-completeness flag. Tests in `gbs-grader.test.ts` cover every
band boundary (urea 6.5/8.0/10.0/25.0; Hb 100/120/130 for both sexes; SBP
90/100/110; pulse 100) and the total endpoints 0 and 23.

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
