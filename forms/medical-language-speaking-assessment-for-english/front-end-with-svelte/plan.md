# Plan: Medical Language Speaking Assessment for English — consolidated front-end (SvelteKit)

## Current status

Complete. Consolidated single front-end (`front-end-with-svelte/`) replacing the
legacy split form/dashboard projects.

- Pure OET scoring engine in `src/lib/engine/` (`types.ts`, `rules.ts`,
  `oet-grader.ts`, `flagged-issues.ts`, `utils.ts`) with Vitest tests.
- Five step components in `src/lib/components/steps/`.
- Id-keyed reactive store in `src/lib/stores/assessment.svelte.ts`.
- RESTful routes: `/`, `/<plural>` (dashboard), `/<plural>/[id]` (wizard),
  `/<plural>/[id]/report` (+ PDF endpoint).
- Lily Design System UI components and theme catalogue.
