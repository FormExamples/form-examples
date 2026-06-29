# Plan: Cardiopulmonary Resuscitation Training — front-end (SvelteKit)

## Current status

Complete. Consolidated gold-standard `front-end-with-svelte/`:

- Pure TypeScript BLS engine in `src/lib/engine/` with Vitest tests.
- Eight step components in `src/lib/components/steps/`.
- Lily headless UI components in `src/lib/components/ui/`.
- Id-keyed reactive store in `src/lib/stores/assessment.svelte.ts`.
- RESTful routes: dashboard `/cardiopulmonary-resuscitation-trainings/`,
  wizard `/cardiopulmonary-resuscitation-trainings/[id]`, plus
  `[id]/report` and `[id]/report/pdf`.
- 45 Lily themes + ThemeSelect; welcome page; themed layout.

## Future work

- Wire the dashboard to the Loco back-end API (currently sample-data only).
