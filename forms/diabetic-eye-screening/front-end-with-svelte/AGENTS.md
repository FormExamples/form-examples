# Diabetic Eye Screening — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the diabetic-eye-screening specification and classification engine. Lily
Svelte headless conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and result-classification** form — the engine derives
a worst-eye summary across both eyes then resolves each record to exactly one
`recallPathway` and one `referral` via a gated, first-match cascade ordered by
clinical urgency. There is no numeric score.

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `diabetic-eye-rules.ts`, `diabetic-eye-grader.ts`, `flagged-issues.ts`) +
  `diabetic-eye-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (5 steps: context, patient, right eye, left eye, summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/diabetic-eye-screenings/` — RESTful routes: `/<plural>/` (dashboard,
  `ssr = false`) + `/<plural>/[id]` (wizard) + `/<plural>/[id]/report`
  (+ `report/pdf` server endpoint).

## Engine

Worst-eye derivation then gated first-match classification (no total).
Retinopathy severity ranks `R0 < R1 < R2 < R3S < R3A`; the worst R and M grade
across both eyes plus any ungradable marker map to a recall / referral pathway
by clinical urgency (R3A → refer-hes-urgent; M1/R3S → refer-hes; ungradable →
refer-slit-lamp; R2 → surveillance-6-month; R1 / R0-not-low-risk →
routine-12-month; R0 low-risk → routine-24-month). `calculateGrade` returns the
worst-eye grades, the outcome, the referral, the recall interval, the
completeness status, the fired-rule audit trail, and the flagged issues
(computed independently). An ungradable eye does not contribute a retinopathy
grade.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- An ungradable eye is excluded from the worst-eye retinopathy derivation.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
