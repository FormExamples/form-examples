# Plan: Workplace Stress Assessment — consolidated front-end (SvelteKit)

## Current status

Complete. Single consolidated `front-end-with-svelte/`:

- Pure grading engine in `src/lib/engine/` (`types.ts`, `rules.ts`,
  `stress-grader.ts`, `flagged-issues.ts`, `utils.ts`) with a Vitest suite
  (`stress-grader.test.ts`).
- Nine step components in `src/lib/components/steps/` (demographics + seven HSE
  domains + comments), domain steps sharing `ui/LikertDomain.svelte`.
- Id-keyed reactive store `src/lib/stores/assessment.svelte.ts` with in-place
  `deepAssign` merge and localStorage persistence.
- RESTful routes under `src/routes/workplace-stress-assessments/`: SVAR
  dashboard (`ssr = false`), wizard, report, and PDF endpoint.
- Lily token theming: `src/app.css`, 45 themes, `ThemeSelect`.

## Verify

- `pnpm run check` — 0 errors, 0 warnings
- `pnpm run build` — succeeds
- `pnpm exec vitest run` — engine tests pass
