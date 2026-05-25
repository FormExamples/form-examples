# Front-end dashboard with HTML — FP92A

Static review dashboard listing FP92A medical exemption certificate
applications. Vanilla HTML / CSS / JavaScript — no framework, no build step.

## Files

- `index.html` — table markup, filter bar
- `css/style.css` — NHS-themed styles
- `js/types.js` — label dictionaries
- `js/data.js` — bundled sample applications (fallback)
- `js/api.js` — `fetchApplications()` with sample-data fallback
- `js/app.js` — filter wiring and rendering

## Running

Open `index.html` in any modern browser. No server required.

## Backend

If a backend is reachable at `/api/applications`, results are fetched from
there; otherwise the bundled sample list is shown with a status banner.

## See also

- [`../index.md`](../index.md) — overall form design
- [`../sql-migrations/`](../sql-migrations/) — canonical data model
- [`../front-end-form-with-html/`](../front-end-form-with-html/) — sister wizard

## Lily Design System HTML headless

This dashboard conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) §3
(`.data-table-*` family) for the shared vocabulary, filter shape
(`.text-input`, `.select`), and `.alert[data-type]` status messages.
