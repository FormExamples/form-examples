# ReSPECT — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md), [`../AGENTS.md`](../AGENTS.md),
and the living spec [`../spec/index.md`](../spec/index.md) for the ReSPECT
data model and completeness engine. Lily Svelte headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a documentation / completeness form, not a scored assessment: the engine
returns `{ status, completenessPercent, satisfiedCount, firedRules,
flaggedIssues }` — no numeric clinical score.

## Layout

- `src/lib/engine/` — pure completeness engine (`types.ts`, `utils.ts`,
  `respect-rules.ts`, `respect-grader.ts`, `flagged-issues.ts`) +
  `respect-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (Step1Personal … Step9Summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample plans + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/plans/` — RESTful routes: `/plans` (dashboard, `ssr = false`) +
  `/plans/[id]` (wizard) + `/plans/[id]/report` (+ `report/pdf` server endpoint).

## Conventions

- Empty string `''` for unanswered text / enum / date fields.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- The capacity section (step 7) is conditional; its proxy / consultee rule (R7)
  and the capacity-missing flag both key off `hasCapacity === 'no'`.
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
