# Plan: Allergy Skin Test Request — consolidated front-end (SvelteKit)

## Current status

Complete. Gold-standard consolidated `front-end-with-svelte/`:

- Pure four-axis engine in `src/lib/engine/` (types, defaults, rules, flags,
  grader, utils) ported from the canonical HTML JS engine, with a Vitest suite.
- Id-keyed reactive store `src/lib/stores/request.svelte.ts` (in-place
  `deepAssign`, localStorage key `allergy-skin-test-request.front-end-with-svelte.<id>.v1`).
- Seven step components in `src/lib/components/steps/`.
- RESTful routes: `/allergy-skin-test-requests` (SVAR dashboard, `ssr = false`),
  `/allergy-skin-test-requests/[id]` (wizard), `[id]/report`, `[id]/report/pdf`.
- Welcome page, themed layout (45 Lily themes), Lily token utilities only.

## Future work

- Wire the dashboard and form to the Loco back-end JSON API in place of the
  in-memory sample data fallback.
