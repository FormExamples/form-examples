# ZBI — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the Zarit Burden Interview specification and scoring engine. Lily Svelte
headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure scoring engine (`types.ts`, `utils.ts`,
  `zarit-rules.ts`, `zarit-grader.ts`, `flagged-issues.ts`) +
  `zarit-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections;
  `ZaritItemField.svelte` renders one item as a five-option (0-4) radio group.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/zarit-burden-interviews/` — RESTful routes: `/<plural>/`
  (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Scoring model

Item responses are stored as the RAW 0-4 frequency rating; there is no
reverse-scoring (a higher rating always means greater burden). The grader sums
the answered ratings over the active item set: ZBI-22 scores all 22 items
(total 0-88); ZBI-12 scores the 12-item short-form subset (1, 2, 3, 6, 9, 10,
11, 12, 17, 20, 21, 22; total 0-48). Bands — ZBI-22: 0-21 little-or-none, 22-40
mild-to-moderate, 41-60 moderate-to-severe, 61-88 severe; ZBI-12: `>= 17` high,
else lower. Item 22 (global burden) drives the carer mental-health and
high-global-burden flags independently of the total.

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
