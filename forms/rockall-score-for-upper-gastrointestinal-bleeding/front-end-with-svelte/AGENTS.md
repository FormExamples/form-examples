# Rockall Score for Upper Gastrointestinal Bleeding — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the Rockall specification and scoring engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure scoring engine (`types.ts`, `utils.ts`,
  `rockall-rules.ts`, `rockall-grader.ts`, `flagged-issues.ts`) +
  `rockall-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/rockall-scores-for-upper-gastrointestinal-bleeding/` — RESTful
  routes: `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Scoring engine

Additive score: three clinical parameters — age (0/1/2), shock (0/1/2, derived
from systolic blood pressure and heart rate; hypotension SBP < 100 → 2 takes
precedence over tachycardia HR ≥ 100 → 1), and comorbidity (0/2/3) — sum to a
pre-endoscopy (clinical) Rockall score of 0-7. When `endoscopyPerformed == 'yes'`
the two endoscopic parameters — diagnosis (0/1/2) and stigmata (0/2) — extend it
to a full (post-endoscopy) score of 0-11, banded low (≤ 2), intermediate (3-4),
or high (≥ 5). Otherwise the clinical score stands and the band is `clinical-only`
(a clinical 0 reports `low`). A missing numeric input scores 0 for its parameter
and raises a data-completeness flag. Thresholds per spec §4.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
