# Plan: First Aid Training Checklist — consolidated front-end (SvelteKit)

## Current status

Complete. Single consolidated `front-end-with-svelte/`:

- Pure grading engine in `src/lib/engine/` (`types.ts`, `faw-rules.ts`,
  `first-aid-grader.ts`, `flagged-issues.ts`, `utils.ts`) with Vitest tests.
- Ten step components in `src/lib/components/steps/`.
- Id-keyed reactive store in `src/lib/stores/assessment.svelte.ts`.
- RESTful routes under `src/routes/first-aid-training-checklists/`:
  dashboard (`+page.svelte` + `ssr=false`), wizard (`[id]`), report, PDF.
- Welcome page and themed layout (Lily 45-theme catalogue).

## Future work

- Keep the engine aligned with the back-end Loco crate and the HTML front-end.
