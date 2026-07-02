# qSOFA — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Quick Sequential Organ Failure
Assessment (qSOFA): a single continuous single-page wizard plus a clinician
dashboard, styled with the Lily Design System (Svelte headless) and powered by a
pure Svelte 5 scoring engine.

- **Wizard** — `/quick-sequential-organ-failure-assessments/[id]`: six sections
  (context, patient identification, respiratory rate, mentation, systolic blood
  pressure, summary). Live per-criterion point pills and running qSOFA score.
- **Dashboard** — `/quick-sequential-organ-failure-assessments`: SVAR DataGrid
  with the engine-derived qSOFA score, risk band, and escalation flag; filter by
  care setting and risk band.
- **Report** — `/quick-sequential-organ-failure-assessments/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `qsofa-rules.ts`, `qsofa-grader.ts`,
`flagged-issues.ts`. Additive: three criteria (RR >= 22, altered mentation /
GCS < 15, systolic BP <= 100), each 1 point; total 0-3; qSOFA >= 2 is a positive
screen (`higher` risk band). Tests in `qsofa-grader.test.ts`.

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
