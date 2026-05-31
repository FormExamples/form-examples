# Op-note HTML dashboard — Agent Instructions

Static HTML dashboard for reviewing submitted surgical operation notes.
Uses vanilla classic-script JavaScript (no bundler, no module loader) and
the Lily Design System HTML headless class contract. Backed by sample
JSON in `js/data.js`; an optional Loco/axum backend at
`http://localhost:5150/api/operation-notes` is queried first and the
table falls back to sample data when the backend is unreachable.

## Files

- `index.html` — single-page review dashboard with sortable filterable table
- `css/style.css` — styling keyed to Lily class names + project-local helpers
- `js/types.js` — JSDoc type definitions for the row shape
- `js/data.js` — sample op-note rows for standalone demo
- `js/api.js` — backend fetch client with graceful fallback
- `js/app.js` — table render, sort, and filter logic

## Lily Design System HTML headless

This dashboard conforms to the Lily Design System HTML headless class
contract. See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)
§3 (`.data-table-*` family) for the shared vocabulary, filter shape
(`.search-input`, `.select`, `.button`), and `.alert[data-type]` status
messages.

## Columns

hospital, theatre, list type, surgeon, patient (anonymised), primary
procedure (OPCS-4), urgency (NCEPOD), composite risk, Clavien–Dindo,
EBL (mL), counts agreed, never-event flag, recovery destination, signed.

## Filters

- Search (patient, NHS number, hospital, surgeon, procedure)
- Composite risk: routine / complicated / high-risk / critical
- Clavien–Dindo: 0 / I / II / IIIa / IIIb / IVa / IVb / V
- Urgency (NCEPOD): elective / scheduled / urgent / immediate
- Never-event flag: with / without
- Sign-off status: signed / unsigned
