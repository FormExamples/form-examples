# Agile Checklist — Static HTML Dashboard Tasks

## Done

- [x] Sample data in `js/data.js` (15 rows, 6 teams, full maturity spread)
- [x] `js/api.js` with `/api/checklists` fetch + sample-data fallback
- [x] `index.html` with tiles, filters, individuals + teams tables
- [x] `js/app.js` rendering, sorting, filtering, CSV export, SVG sparklines
- [x] `css/style.css`
- [x] Browser smoke test: 15 rows load via sample fallback, tiles tally
      correctly, teams view aggregates to 6 teams with 5 sparklines,
      ad-hoc filter narrows to 1, sort by overall ascending puts 23% first
- [x] CSV import for offline review — "Import CSV" file picker accepts any
      CSV with the same shape produced by Export CSV. "Reset to sample"
      button restores the bundled sample data. Malformed CSVs show a status
      message and preserve current rows. Browser smoke-tested with
      well-formed and malformed inputs.
- [x] Per-submission detail view — clicking "Detail →" on any individuals
      row opens an inline `<aside id="detail-panel">` with the composite
      maturity banner, per-section breakdown, respondent metadata, weak
      sections, operational flags, and the team trend sparkline. Close
      button clears the panel. Browser smoke-tested end-to-end.
- [x] LocalStorage cache of last successful API response — successful
      `/api/checklists` writes to `agile-checklist-dashboard:cache:v1`;
      on subsequent visits the cache hydrates (within a 24h TTL) before
      a fresh fetch is attempted, and the status banner shows the
      cached-from timestamp when the API is unreachable. Browser
      smoke-tested: mocked API → cache populated → offline reload serves
      cached rows with "Offline — showing cached data from …" status.
- [x] Principles-vs-behaviour comparison view at `comparison.html` —
      vanilla-JS port of the SvelteKit comparison module. Dual file
      input (principles + checklist CSVs), 5 quadrant tiles, scatter SVG,
      per-team table. Browser smoke-tested with a 4-team fixture that
      lands one team in each quadrant — output matches the SvelteKit
      comparison view exactly.

## Pending

(none)
