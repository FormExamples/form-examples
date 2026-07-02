# Medication Reconciliation — SvelteKit front-end (wizard + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the reconciliation specification and engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure engine (`types.ts`, `utils.ts`,
  `medication-reconciliation-rules.ts`, `medication-reconciliation-grader.ts`,
  `flagged-issues.ts`) + `medication-reconciliation-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultReconciliation()`.
- `src/lib/components/ui/ListEditor.svelte` — generic repeating one-to-many row
  editor driving all four child lists.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/medication-reconciliations/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric; `[]`
  for the four child lists.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.
- This is a documentation-and-completeness form: the engine derives a STATUS and
  counts, not a numeric score.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
