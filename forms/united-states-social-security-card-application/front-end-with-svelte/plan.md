# Plan: Social Security Card Application (Form SS-5) — SvelteKit front-end (form + dashboard)

Status: built. The engine is ported from the HTML front-end and replays
`examples/personas.json` in its Vitest suite so both engines agree.

- [x] Engine (`src/lib/engine/`): `types.ts`, `defaults.ts`, `utils.ts`,
      `ss5-rules.ts`, `ss5-grader.ts`, `flagged-issues.ts`.
- [x] `ss5-grader.test.ts` covering each class, the replacement limits and
      exceptions, the age rules, and every persona.
- [x] Step components `Step1Request` to `Step6Summary`.
- [x] Dashboard with SVAR DataGrid, report page, and PDF export.
- [x] Lint, format, check, and Vitest gates.
