# United Kingdom Vehicle Bill of Sale — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and classification / validation engine. Lily Svelte
headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **completeness and validity** instrument — the engine emits a classification
(`complete` / `incomplete` / `risk-flagged`), missing-item and risk counts, and a set of flagged
issues. There is **no numeric score**; it is documentation support, not legal advice.

## Layout

- `src/lib/engine/` — pure classification / validation engine (`types.ts`,
  `utils.ts`, `bill-of-sale-rules.ts`, `bill-of-sale-grader.ts`, `flagged-issues.ts`) +
  `bill-of-sale-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultBillOfSale()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (9 steps: sale, seller, buyer, vehicle, checks, payment, condition, DVLA, signatures).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/united-kingdom-vehicle-bills-of-sale/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Ported from the HTML front-end's `js/{types,rules,grader,flags}.js`. The grader
`assessBillOfSale(data)` evaluates the risk conditions and the required items, assigns one
classification (precedence `risk-flagged` > `incomplete` > `complete`), and calls
`detectFlaggedIssues`. All functions are pure — no I/O, no legal judgement.

## Conventions

- camelCase property names mirror the snake_case SQL columns.
- Text / enum fields default to `''`; numeric, date, and time fields default to `null`.
- Generic Lily `Badge`; no cardiovascular entry components.
- Engine tests use a LOCAL `createDefaultBillOfSale` fixture (no store import).
- HTML entities `&lt; &gt; &le; &ge;` in Svelte template text.

## Verify

```sh
pnpm install
pnpm run check
pnpm run build
pnpm exec vitest run
```
