# Plan: Angiography Test Request — front-end (SvelteKit)

## Current status

Complete. Consolidated `front-end-with-svelte` built to the gold standard:
welcome page, SVAR DataGrid vetting dashboard, seven-step request wizard,
vetting report, and server-rendered PDF. `pnpm check`, `pnpm build`, and the
Vitest engine suite all pass; no hardcoded palette colours (Lily tokens only).

## Architecture

- Pure four-axis engine in `src/lib/engine/` (`types`, `defaults`, `rules`,
  `flags`, `grader`, `utils`) with `grader.test.ts`.
- Id-keyed reactive store `src/lib/stores/request.svelte.ts` (exports `request`,
  re-exports `createDefaultRequest`) with in-place `deepAssign` and localStorage
  persistence (`angiography-test-request.front-end-with-svelte.<id>.v1`).
- RESTful routes under `src/routes/angiography-test-requests/`.
- Sample records + engine-derived dashboard rows in
  `src/lib/data/sample-reports.ts`.

## Future work

- Wire the dashboard to the Loco back-end API (currently sample-data only).
