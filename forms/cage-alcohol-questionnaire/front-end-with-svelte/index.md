# CAGE — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the CAGE Alcohol Questionnaire: a single
continuous single-page wizard plus a clinician dashboard, styled with the Lily
Design System (Svelte headless) and powered by a pure Svelte 5 scoring engine.

- **Wizard** — `/cage-alcohol-questionnaires/[id]`: seven sections (context,
  patient identification, and the four lifetime CAGE items — cut down, annoyed,
  guilty, eye-opener — plus summary). Live per-criterion point pills and running
  CAGE score.
- **Dashboard** — `/cage-alcohol-questionnaires`: SVAR DataGrid with the
  engine-derived CAGE score, result band, and positive-screen flag; filter by
  care setting and result band.
- **Report** — `/cage-alcohol-questionnaires/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `cage-rules.ts`, `cage-grader.ts`,
`flagged-issues.ts`. Additive: four lifetime yes/no items (cut down, annoyed,
guilty, eye-opener), each 1 point for a "yes"; total 0-4; CAGE >= 2 is a
positive screen (`positive` result band), CAGE 1 is sub-threshold (`low`),
CAGE 0 is `negative`. Tests in `cage-grader.test.ts`.

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
