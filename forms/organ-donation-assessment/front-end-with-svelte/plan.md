# Plan: Organ Donation Assessment — front end (SvelteKit)

## Current status

Complete. Consolidated gold-standard `front-end-with-svelte/`:

- Pure grading engine in `src/lib/engine/` (`types.ts`, `donation-rules.ts`,
  `donation-grader.ts`, `flagged-issues.ts`, `utils.ts`) with Vitest tests
  (`donation-grader.test.ts`).
- Ten step components in `src/lib/components/steps/` (steps 8 & 9 are
  living-donor only).
- id-keyed reactive store in `src/lib/stores/assessment.svelte.ts`.
- RESTful routes: `/organ-donation-assessments` (SVAR dashboard),
  `/organ-donation-assessments/[id]` (wizard),
  `/organ-donation-assessments/[id]/report` (+ `report/pdf`), welcome page, and
  a themed layout with the 45 Lily themes.

## Verify

```sh
pnpm install --prefer-offline
pnpm run check
pnpm run build
pnpm exec vitest run
```
