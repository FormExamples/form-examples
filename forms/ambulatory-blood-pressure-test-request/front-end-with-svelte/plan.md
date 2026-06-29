# Plan: Ambulatory Blood Pressure Test Request — front-end (SvelteKit)

## Current status

Built. Consolidated gold front-end with a single-page wizard, a SVAR DataGrid
vetting dashboard, an id-keyed reactive store, a pure four-axis grading engine,
a vetting report, and a server-side PDF endpoint.

## Structure

- `src/lib/engine/` — `types.ts`, `defaults.ts`, `rules.ts`, `flags.ts`,
  `grader.ts`, `utils.ts`, `grader.test.ts`.
- `src/lib/stores/request.svelte.ts` — id-keyed store (`request`) with in-place
  `deepAssign` and localStorage persistence.
- `src/lib/components/steps/` — six step components.
- `src/lib/data/sample-reports.ts` — four engine-derived sample requests + rows.
- `src/routes/ambulatory-blood-pressure-test-requests/` — dashboard, wizard,
  report, and PDF routes.

## Verify

```sh
pnpm install
pnpm run check
pnpm run build
pnpm exec vitest run
```
