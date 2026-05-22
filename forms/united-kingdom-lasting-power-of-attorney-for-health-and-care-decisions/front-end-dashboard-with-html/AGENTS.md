# UK LPA dashboard — static HTML — Agent Instructions

Single-page static HTML dashboard listing every LPA record with sortable
columns and validity-status filters. Alpine.js drives interactivity; a
sample-data fallback runs the page standalone.

## Files

- `index.html` — table shell with column headers, filter dropdowns
- `sample.js` — fallback dataset
- `api.js` — `fetch` wrapper for the back-end with sample-data fallback
- `style.css` — minor overrides to Tailwind defaults

## Columns

- Donor name (NHS-number masked)
- Number of attorneys / replacement attorneys
- Decision-rule type (jointly / severally / mixed)
- Life-sustaining-treatment option (A / B / blank)
- Validity status (`ready-to-register` / `needs-correction` / `invalid`)
- Completeness score (%)
- Registration stage (draft / submitted / registered)
- Updated-at timestamp

## Filters

- Validity status — dropdown
- Registration stage — dropdown
- Jurisdiction — England / Wales / unknown
