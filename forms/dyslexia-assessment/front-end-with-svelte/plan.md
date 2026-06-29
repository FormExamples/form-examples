# Plan: Dyslexia Assessment — patient form (SvelteKit)

## Current status

Consolidated gold front-end built. Engine, store, steps, routes, dashboard, report, and PDF endpoint are implemented and pass `pnpm run check`, `pnpm run build`, and `pnpm exec vitest run`.

## Structure

- `src/lib/engine/` — pure scoring engine: `types.ts`, `dyslexia-rules.ts`, `dyslexia-grader.ts`, `flagged-issues.ts`, `utils.ts`, `dyslexia-grader.test.ts`
- `src/lib/stores/assessment.svelte.ts` — id-keyed reactive store with localStorage persistence
- `src/lib/components/steps/` — ten step components (`StepNName.svelte`)
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows
- `src/routes/dyslexia-assessments/` — RESTful list + `[id]` wizard + `[id]/report` + `[id]/report/pdf`
