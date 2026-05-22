# Plan: static HTML dashboard

## Build order

1. [ ] Author `index.html` with Tailwind + Alpine CDN tags.
2. [ ] Author `js/sample-data.js` with five realistic Return to Work
       rows.
3. [ ] Wire the filter / sort dropdowns to Alpine state.
4. [ ] Wire `fetch('/api/v1/return-to-work')` with the sample-data
       fallback.

## Future enhancements

- CSV / TSV export.
- Print-friendly stylesheet.
- Drill-down panel that renders the full statement-of-fitness preview.
