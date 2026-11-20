# United Kingdom Council Tax Discount Application — SvelteKit front-end (form + dashboard)

SvelteKit + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and the eligibility engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **completeness and eligibility** instrument: the engine emits an
eligibility class (`likely-eligible` / `incomplete` / `likely-ineligible`), the
counted adults, an indicative outcome and flagged issues. There is **no numeric
score**, and **eligibility is decided by the billing authority**.

## Layout

- `src/lib/engine/` — pure engine (`types.ts`, `utils.ts`, `ctda-rules.ts`,
  `ctda-grader.ts`, `flagged-issues.ts`) + `ctda-grader.test.ts`, which also
  checks every persona in `../examples/personas.json`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign`, `createDefaultApplication()`.
- `src/lib/components/steps/` — `StepNName.svelte` wizard sections (5 steps:
  claim, applicant and property, household roster, evidence, declaration).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/united-kingdom-council-tax-discount-application/united-kingdom-council-tax-discount-applications/`
  — `/<plural>/` (dashboard, `ssr = false`), `/<plural>/[id]` (wizard),
  `/<plural>/[id]/report` (+ `report/pdf`).

## Conventions

- camelCase property names mirror the snake_case SQL columns.
- Text / enum fields default to `''`; numeric and date fields default to `null`.
- Engine tests use a LOCAL fixture (no store import).

## Verify

```sh
pnpm install
pnpm run check
pnpm run build
pnpm exec vitest run
pnpm run lint && pnpm run format:check
```
