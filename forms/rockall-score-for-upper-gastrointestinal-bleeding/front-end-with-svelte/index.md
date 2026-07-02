# Rockall Score for Upper Gastrointestinal Bleeding — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Rockall Score for Upper Gastrointestinal
Bleeding: a single continuous single-page wizard plus a clinician dashboard,
styled with the Lily Design System (Svelte headless) and powered by a pure Svelte
5 scoring engine.

- **Wizard** — `/rockall-scores-for-upper-gastrointestinal-bleeding/[id]`: six
  sections (context, patient identification, shock, comorbidity, endoscopy,
  summary). Live per-parameter points and a live clinical / full score with risk
  band readout.
- **Dashboard** — `/rockall-scores-for-upper-gastrointestinal-bleeding`: SVAR
  DataGrid with the engine-derived clinical and full Rockall scores, risk band,
  and flag count; filter by care setting and risk band.
- **Report** — `/rockall-scores-for-upper-gastrointestinal-bleeding/[id]/report`
  with a server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `rockall-rules.ts`,
`rockall-grader.ts`, `flagged-issues.ts`. Additive score: three clinical
parameters — age (0/1/2), shock (0/1/2, derived from systolic blood pressure and
heart rate: hypotension SBP < 100 → 2 takes precedence over tachycardia HR ≥ 100
→ 1), and comorbidity (0/2/3) — summed to a pre-endoscopy (clinical) Rockall
score of 0-7. When endoscopy has been performed, two endoscopic parameters —
diagnosis (0/1/2) and stigmata of recent haemorrhage (0/2) — extend it to a full
(post-endoscopy) score of 0-11, banded low (≤ 2), intermediate (3-4), or high
(≥ 5). Without endoscopy the clinical score stands and the band is reported
`clinical-only` (except a clinical 0, reported `low`). Missing numeric inputs
score 0 and raise a completeness flag. Tests in `rockall-grader.test.ts`.

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
