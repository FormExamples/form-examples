# Plan: Return to Work — consolidated front-end (SvelteKit)

## Current status

Complete. Single consolidated `front-end-with-svelte/` built from the gold
template: 12-step wizard, SVAR dashboard, report, and PDF endpoint.

- Engine in `src/lib/engine/` (`rtw-grader.ts`, `restriction-rules.ts`,
  `flagged-issues.ts`, `types.ts`, `utils.ts`) with Vitest coverage.
- Step components `Step1Clinician` … `Step12SignOff` in
  `src/lib/components/steps/`.
- Id-keyed reactive store `src/lib/stores/assessment.svelte.ts`
  (localStorage key `return-to-work.front-end-with-svelte.<id>.v1`).
- RESTful routes under `/return-to-work-records/`.

## Verify

```sh
pnpm install && pnpm run check && pnpm run build && pnpm exec vitest run
```
