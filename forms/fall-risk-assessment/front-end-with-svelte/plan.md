# Plan: Fall Risk Assessment — consolidated front-end (SvelteKit)

## Current status

Complete. Single-page wizard (10 steps), SVAR DataGrid dashboard, graded
report, and server-rendered PDF are all implemented and verified
(`pnpm check`, `pnpm build`, `pnpm exec vitest run` all green).

## Architecture

- Pure scoring engine in `src/lib/engine/` (`types.ts`, `mfs-rules.ts`,
  `fall-risk-grader.ts`, `flagged-issues.ts`, `utils.ts`); tests in
  `fall-risk-grader.test.ts`.
- Id-keyed reactive store `src/lib/stores/assessment.svelte.ts` with in-place
  `deepAssign` deep-merge and localStorage persistence.
- Step components `src/lib/components/steps/StepNName.svelte`.
- Lily Svelte headless UI components in `src/lib/components/ui/`.
- Sample records + engine-derived dashboard rows in
  `src/lib/data/sample-reports.ts`.
