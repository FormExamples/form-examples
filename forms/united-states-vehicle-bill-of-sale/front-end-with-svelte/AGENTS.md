# United States Vehicle Bill of Sale — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and classification engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation-support and completeness-classification** instrument:
the engine emits a class (`complete` / `incomplete` / `risk-flagged`), an
odometer-exemption indicator, a state-rule-known indicator, and a set of flagged
issues. There is **no numeric score**, and it is **not legal advice**.

## Layout

- `src/lib/engine/` — pure engine (`types.ts`, `utils.ts`, `defaults.ts`,
  `bill-of-sale-rules.ts`, `bill-of-sale-grader.ts`, `flagged-issues.ts`) +
  `bill-of-sale-grader.test.ts` (which also runs every persona).
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge. `createDefaultBillOfSale()`
  lives in `engine/defaults.ts`, not in the store.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (7 steps: transaction, seller, buyer, vehicle, odometer, terms, after sale).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `states.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — one sample per persona + engine-derived rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/united-states-vehicle-bill-of-sale/united-states-vehicle-bills-of-sale/`
  — RESTful routes: `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]`
  (wizard) + `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Ported from the HTML front-end's `js/{types,rules,grader,flags}.js`. The grader
`validateBillOfSale(data)` assigns one class (precedence `risk-flagged` >
`incomplete` > `complete`) and calls `detectFlaggedIssues`. All functions are
pure apart from the clock used by the deadline flags.

## Conventions

- camelCase property names mirror the snake_case SQL columns.
- Text / enum fields default to `''`; numeric and date fields default to `null`.
- Engine tests build their blank state from `engine/defaults.ts` (no store import).
- HTML entities `&lt; &gt; &le; &ge;` in Svelte template text.

## Verify

```sh
pnpm install
pnpm run check
pnpm run build
pnpm exec vitest run
pnpm run lint && pnpm run format:check
```
