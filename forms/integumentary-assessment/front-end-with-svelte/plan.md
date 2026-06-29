# Plan: Integumentary Assessment — front-end (SvelteKit)

## Current status

Complete. Consolidated gold front-end built from the canonical SvelteKit
template:

- Pure Braden Scale + flagged-issue engine in `src/lib/engine/` with Vitest tests
- Nine step components in `src/lib/components/steps/`
- id-keyed reactive store in `src/lib/stores/assessment.svelte.ts`
- RESTful routes: welcome `/`, dashboard `/integumentary-assessments`,
  wizard `/integumentary-assessments/[id]`, report `+ /report` and `/report/pdf`
- SVAR DataGrid dashboard with engine-derived rows
- 45 Lily themes + ThemeSelect; Lily token utilities only (no raw palette)

## Future work

- Wire the dashboard to the Loco back-end JSON API (currently sample data)
