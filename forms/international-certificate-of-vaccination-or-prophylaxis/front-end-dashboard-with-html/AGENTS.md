# ICVP — Static HTML dashboard — agent instructions

Self-contained static HTML / CSS / vanilla JavaScript implementation of the
ICVP review dashboard. No build step. No external runtime dependencies.

## Conventions

- ES module-free vanilla JavaScript, supported by all modern browsers from
  2022 onward.
- Sample data embedded in `script.js` as a `SAMPLE_CERTIFICATES` array of
  certificate objects (about 10 entries, mix of diseases and statuses).
- The table is rendered into `<tbody id="certificates">` from the filtered,
  sorted view of the sample data.
- Filters write into a `filters` object; the visible view is recomputed and
  re-rendered on every `change` event.
- Selecting a row updates the `<aside id="detail">` panel with the
  certificate's vaccination entries.

## Acceptance

- `index.html` opens directly in a browser.
- Sortable column headers (toggle ascending / descending).
- Disease, status, and centre dropdowns plus a free-text search box.
- Row click opens the detail panel showing the entries for that
  certificate.
