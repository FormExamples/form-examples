# Plan: Eye Prescription — HTML Dashboard

## Build order

1. Author `index.html` with a `<table>` and a top filter bar.
2. Author `assets/sample-data.js` — same shape as the SvelteKit
   dashboard's `sample-data.ts`.
3. Author `assets/script.js` — Alpine.js component with state, sort,
   filter.

## Design principles

- No build step; CDN-hosted Tailwind + Alpine.
- Same column set and visual design as the SvelteKit dashboard.

## Out of scope

- Detail view (linked out to the back-end if available).
- CSV export.
