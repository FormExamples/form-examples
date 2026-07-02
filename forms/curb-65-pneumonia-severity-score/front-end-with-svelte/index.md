# CURB-65 — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the CURB-65 Pneumonia Severity Score: a
single continuous single-page wizard plus a clinician dashboard, styled with the
Lily Design System (Svelte headless) and powered by a pure Svelte 5 scoring
engine.

- **Wizard** — `/curb-65-pneumonia-severity-scores/[id]`: nine sections
  (context, patient identification, confusion, urea, respiratory rate, blood
  pressure, age, adjuncts, score and disposition). Live per-criterion point pills
  and running severity score.
- **Dashboard** — `/curb-65-pneumonia-severity-scores`: SVAR DataGrid with the
  engine-derived severity score, score variant (CURB-65 / CRB-65), risk band, and
  admit flag; filter by care setting and risk band.
- **Report** — `/curb-65-pneumonia-severity-scores/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `curb65-rules.ts`,
`curb65-grader.ts`, `flagged-issues.ts`. Additive: five criteria (Confusion,
Urea > 7 mmol/L, Respiratory rate >= 30, systolic < 90 or diastolic <= 60, Age
>= 65), each 1 point; total 0-5 banded 0-1 low / 2 intermediate / 3-5 high.
CRB-65 fallback (0-4, no urea) when serum urea is unavailable. Tests in
`curb65-grader.test.ts`.

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
