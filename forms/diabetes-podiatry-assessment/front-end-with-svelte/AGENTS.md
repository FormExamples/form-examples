# Diabetes Podiatry Assessment — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the diabetes-podiatry-assessment specification and classification engine.
Lily Svelte headless conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **risk-stratification** form — the engine classifies each foot's
risk independently, applies patient-wide high-risk/urgent overrides, and
resolves each record to exactly one `reviewPathway` and one `referral` via a
gated, first-match cascade ordered by clinical urgency. There is no numeric
score.

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `podiatry-rules.ts`, `podiatry-grader.ts`, `flagged-issues.ts`) +
  `podiatry-rules.test.ts` + `podiatry-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (5 steps: context, risk factors, right foot, left foot, summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`, `text-sizes.ts`, `locales.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/diabetes-podiatry-assessment/diabetes-podiatry-assessments/` —
  RESTful routes: `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]`
  (wizard) + `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Per-foot risk-factor count then worst-foot with overrides (no total).
`perFootRiskFactorCount` counts insensate neuropathy, diminished/absent
pulses, deformity, and callus/skin breakdown (combined as one factor); 0
factors is low, 1 is moderate, 2+ is high. `perFootRisk` then applies the
active-urgent override (active ulcer or suspected Charcot) and the
at-least-high override (previous ulcer or amputation). The worse of the two
feet, raised to at least high by renal replacement therapy, becomes
`overallRisk`; a gated first-match cascade over that context resolves the
`reviewPathway`, `referral`, and `reviewIntervalMonths` (1 month when the
triggering foot also carries an ulcer/amputation history, else 3 months for
combined-factor high risk; 6 months moderate; 12 months low; null for
active-urgent). `calculateGrade` returns the per-foot and overall risk, the
review pathway, referral, interval, the completeness status, the fired-rule
audit trail, and the flagged issues (computed independently).

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
