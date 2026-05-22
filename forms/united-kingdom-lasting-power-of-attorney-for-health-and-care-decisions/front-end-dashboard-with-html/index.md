# UK LPA dashboard — static HTML review table

Static HTML dashboard that lists every LPA on file with summary columns —
donor name, attorney count, validity status, registration stage,
completeness score — and filters by validity status and jurisdiction.

## Stack

- HTML 5 + CSS 3 (Tailwind via CDN)
- Alpine.js 3.14.8 for filtering and sorting
- Vanilla `fetch` against the back-end API with a sample-data fallback
- No build step; deployable as a single directory of static files

## Running

Open `index.html` in any modern browser. With no back-end available the
dashboard renders the bundled `sample.js` rows.
