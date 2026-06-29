# Plan: Post-Operative Report — consolidated front-end (SvelteKit)

## Current status

Implemented: consolidated `front-end-with-svelte/` with a single-page 10-step
wizard, the Clavien-Dindo grading engine (ported to TypeScript from the HTML
reference front-end), an SVAR DataGrid dashboard, id-keyed localStorage store,
report view, and server-side PDF generation.

## Structure

- `src/lib/engine/` — pure grading engine + Vitest tests
- `src/lib/components/steps/` — 10 `StepN*.svelte` wizard sections
- `src/lib/components/ui/` — Lily Svelte headless components + list editors
- `src/lib/stores/assessment.svelte.ts` — id-keyed reactive store
- `src/lib/data/sample-reports.ts` — sample records + engine-derived rows
- `src/routes/post-operative-reports/` — dashboard + `[id]` wizard/report/pdf
