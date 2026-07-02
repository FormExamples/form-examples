# Apgar Score — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Apgar Score: a single continuous
single-page wizard plus a clinician dashboard, styled with the Lily Design
System (Svelte headless) and powered by a pure Svelte 5 scoring engine.

- **Wizard** — `/apgar-scores/[id]`: four sections (birth context, newborn
  identification, timepoint assessments, resuscitation and summary). The
  timepoint step is a repeating editor — the newborn is scored at 1 and 5
  minutes (always present), and again at 10 minutes and beyond whenever the
  5-minute total is below 7. Each timepoint scores the five APGAR signs
  (Appearance, Pulse, Grimace, Activity, Respiration) with a live per-timepoint
  total and band.
- **Dashboard** — `/apgar-scores`: SVAR DataGrid with the engine-derived lowest
  total, 5-minute total, summary band, and trend; filter by care setting and
  band.
- **Report** — `/apgar-scores/[id]/report` with a server-generated PDF
  (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `apgar-rules.ts`, `apgar-grader.ts`,
`flagged-issues.ts`. Additive per timepoint: sum the five signs (each 0/1/2) to
a total of 0-10; the total determines the band (`>= 7` reassuring, `4-6`
moderately low, `<= 3` low). The trend compares consecutive scored timepoints.
A missing sign contributes 0 and raises a data-completeness flag. Tests in
`apgar-grader.test.ts`.

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
