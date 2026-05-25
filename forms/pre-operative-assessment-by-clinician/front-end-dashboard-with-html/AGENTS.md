# Clinician HTML dashboard — Agent Instructions

Static HTML dashboard for reviewing pre-operative assessments. Uses
Alpine.js and Tailwind CDN. Backed by sample JSON in `js/sample-data.js`.

## Files

- `index.html` — table of assessments
- `css/style.css` — styling
- `js/dashboard.js` — loads sample data and populates the table
- `js/sample-data.js` — seed rows for demo

## Lily Design System HTML headless

This dashboard conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) §3
(`.data-table-*` family) for the shared vocabulary, filter shape
(`.text-input`, `.select`), and `.alert[data-type]` status messages.
