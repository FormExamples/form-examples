# United Kingdom Divorce Application — SvelteKit front-end plan

## Status

Built as of 2026-11-20: engine port with Vitest tests, store, seven wizard
steps, the dashboard, the report page and the PDF endpoint.

## Done

- [x] Engine (`src/lib/engine/`): `types.ts`, `utils.ts`, `divorce-rules.ts`,
      `divorce-grader.ts`, `flagged-issues.ts`, ported from the HTML front-end.
- [x] `divorce-grader.test.ts` pins the shared personas and the gate boundaries.
- [x] Wizard steps 1 to 7, report and PDF, dashboard.
- [x] ESLint + Prettier (`bin/svelte-lint-format-refactor`).
