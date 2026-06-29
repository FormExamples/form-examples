# Plan: International Patient Summary — front-end (SvelteKit)

## Current status

Implemented. Consolidated gold front-end with a single-page wizard, SVAR
clinician dashboard, completeness validation engine, report view, and PDF
export.

## Structure

- `src/lib/engine/` — IPS completeness validation engine + Vitest tests
- `src/lib/components/steps/` — ten step components (`StepNName.svelte`)
- `src/lib/components/ui/` — Lily Svelte headless UI components + repeating-list editors
- `src/lib/stores/assessment.svelte.ts` — id-keyed reactive store
- `src/lib/data/sample-reports.ts` — sample IPS records + engine-derived dashboard rows
- `src/routes/international-patient-summaries/` — dashboard + `[id]` wizard + report + PDF
