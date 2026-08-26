# GRACE ACS — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the GRACE specification and scoring engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure scoring engine (`types.ts`, `utils.ts`,
  `grace-rules.ts`, `grace-grader.ts`, `flagged-issues.ts`) + `grace-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/grace-scores-for-acute-coronary-syndrome/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Scoring engine

The GRACE weighted regression point model. Each of the eight admission variables
maps through a weighted, banded lookup (`grace-rules.ts`): age, heart rate,
systolic BP (inverse weight), serum creatinine (normalized to mg/dL), Killip
class, plus three yes/no contributors (cardiac arrest +39, ST-segment deviation
+28, elevated enzymes +14). The points sum to the GRACE total, read against the
in-hospital (108 / 140) and 6-month (88 / 118) mortality-band thresholds; the
overall risk category is the worse of the two bands (max-band rule). A missing
numeric input contributes 0 points and raises a data-completeness flag.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Serum creatinine stores both the raw value and the entered unit; scoring
  normalizes to mg/dL.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
