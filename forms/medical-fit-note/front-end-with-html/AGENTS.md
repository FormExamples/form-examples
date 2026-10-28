# Medical Fit Note — HTML front-end agent instructions

Agent instructions for this directory. See the form root
[`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md). Lily Design
System headless conventions: [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

## Layout

- `index.html` — single-page wizard (steps rendered by `js/form-app.js`)
- `dashboard.html` — clinician dashboard (`js/dashboard-app.js`)
- `js/fit-note-grader.js` — pure approval engine, rules R-01..R-09. Tested by
  `bin/test-personas`; do not alter behaviour without updating the spec and
  `../examples/personas.json`
- `js/types.js` — `emptyAssessment()` = engine defaults plus employee and
  clinician identification fields (ignored by the engine); option lists
- `js/data.js` — dashboard sample rows, one per persona; keep in step with
  `../examples/personas.json`
- shared fleet assets (`css/themes/`, `css/style.css`, `css/dashboard.css`,
  picker/export/import/restore-banner modules) are copied from the canonical
  reference and must stay uniform: check with `bin/test-vendored-uniformity`

## Conventions

- Single continuous wizard; no multi-page flow.
- Unanswered text/enum fields `''`; unanswered dates and numbers `null`.
- Yes/no engine fields use `'yes'` / `'no'` / `''` (checkboxes write `'yes'`
  or `''`).
- Only the employee name is a hard-required field; every other gap is left
  to the engine to report as a fired rule.
- localStorage keys: `medical-fit-note.front-end-with-html.v1` (draft),
  `medical-fit-note.theme.v1`, `.locale.v1`, `.text-size.v1`.
- `js/table-export.js` self-installs on the dashboard; add no CSV/TSV buttons.

## Back-end wiring

`js/api.js` is the only module that talks to the Loco API (base
`http://localhost:5150`, override via `window.__API_BASE__` or `?api=`). The
dashboard joins six GETs client-side; `form-app.js` calls `saveFitNote` after
grading and shows the result in `#save-status`. Sample-data fallback must stay.
Flow and request order: see `index.md` "Back-end wiring".

## Verify

```sh
bin/test-engines medical-fit-note
bin/test-personas medical-fit-note
bin/lily-html-refactor --check medical-fit-note
bin/es-modules-refactor --check medical-fit-note
bin/test-vendored-uniformity
bin/test-e2e --html medical-fit-note
```
