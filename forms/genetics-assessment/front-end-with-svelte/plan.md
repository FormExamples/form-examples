# Plan: Genetics Assessment — consolidated front-end (SvelteKit)

## Current status

Complete. Consolidated `front-end-with-svelte/` built to gold-standard
conventions: id-keyed reactive store with localStorage persistence, RESTful
routes (`/genetics-assessments` dashboard + `/genetics-assessments/[id]` wizard
+ `[id]/report` + report PDF), themed layout with the Lily theme catalogue, and
a pure scoring engine with Vitest tests.

## Structure

- `src/lib/engine/` — pure scoring engine (`types.ts`, `rules.ts`,
  `genetics-grader.ts`, `flagged-issues.ts`, `utils.ts`) + `genetics-grader.test.ts`
- `src/lib/stores/assessment.svelte.ts` — id-keyed reactive store
- `src/lib/components/steps/` — nine step components
- `src/lib/components/ui/` — Lily Svelte headless components + pedigree/list editors
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows
- `src/routes/genetics-assessments/` — dashboard + wizard + report + PDF
