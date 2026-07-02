# Cervical Screening — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the cervical-screening specification and classification engine. Lily Svelte
headless conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and result-classification** form — the engine resolves
each record to exactly one `resultClass` and one `managementAction` via a gated,
first-match cascade (eligibility → adequacy → hrHPV primary → reflex cytology).
There is no numeric score.

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `cervical-screening-rules.ts`, `cervical-screening-grader.ts`,
  `flagged-issues.ts`) + `cervical-screening-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (9 steps: context, patient, eligibility, consent, symptoms, adequacy, hpv,
  cytology, note).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/cervical-screenings/` — RESTful routes: `/<plural>/` (dashboard,
  `ssr = false`) + `/<plural>/[id]` (wizard) + `/<plural>/[id]/report`
  (+ `report/pdf` server endpoint).

## Engine

Gated first-match classification (no total): eligibility gate → adequacy gate →
hrHPV primary → reflex-cytology refinement → pending fallback. `calculateGrade`
returns the result class, the management action, the completeness status, the
fired-rule audit trail, and the flagged issues (computed independently).

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- A null age never excludes a person (null-age guard in the eligibility gate).
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
