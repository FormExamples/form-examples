# Plan: Palliative Assessment — consolidated front-end (SvelteKit)

## Current status

Built. Consolidated gold-standard `front-end-with-svelte/`:

- ESAS-r scoring engine in `src/lib/engine/` (`types.ts`, `rules.ts`,
  `esas-grader.ts`, `flagged-issues.ts`, `utils.ts`) with Vitest tests
  (`esas-grader.test.ts`).
- Nine step components in `src/lib/components/steps/`.
- Id-keyed reactive store in `src/lib/stores/assessment.svelte.ts`.
- RESTful routes: `/palliative-assessments/` (SVAR dashboard),
  `/palliative-assessments/[id]` (wizard), `[id]/report`, and
  `[id]/report/pdf`, plus a welcome page and themed layout.
- 45 Lily themes + ThemeSelect.

## Future work

- Wire the dashboard and report to the live back-end API when available.
