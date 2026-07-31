# Inpatient Clinical Note — HTML front-end (form + dashboard)

Consolidated HTML front-end built on the Lily Design System headless
conventions. No build step: native ES modules, loaded with
`<script type="module">`.

- `index.html` — the twelve-step single-page wizard.
- `dashboard.html` — the ward dashboard, showing both gradings side by side.

## Engine modules

| File | Role |
| --- | --- |
| `js/types.js` | Data shape, the twelve components, the note-type required-set map, display labels |
| `js/news2.js` | NEWS2 parameter scoring and aggregate derivation (RCP 2017) |
| `js/rules.js` | Per-component `documented` predicates, and the required set resolved per note type |
| `js/acuity.js` | Max-band acuity rules |
| `js/flags.js` | The twelve safety flags |
| `js/grader.js` | Runs both engines; the canonical entry point |

## App modules

| File | Role |
| --- | --- |
| `js/form-app.js` | The wizard: field builders, the repeating-row editor, progress, validation, report |
| `js/dashboard-app.js` | The dashboard: filter, sort, render |
| `js/dashboard-types.js` | JSDoc types for the dashboard row shape |
| `js/data.js` | Sample rows used when the backend is offline |
| `js/api.js` | Backend fetch |

## Vendored Lily helpers

`js/theme-select.js`, `js/locale-select.js`, `js/text-size-picker.js`,
`js/share-picker.js`, `js/date-time-picker.js`, and `js/table-export.js` are
vendored fleet-wide by the tools in `bin/`. Do not hand-edit them; the only
per-form difference is the `STORAGE_KEY` prefix.

`js/date-time-picker.js` is vendored but deliberately unwired — the native
`<input type="datetime-local">` remains the date field, as elsewhere in the
fleet.

See the form root [`../index.md`](../index.md) for the full design description.
