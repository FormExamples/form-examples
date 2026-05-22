# Front-end dashboard with HTML — Agent Instructions

Static single-page HTML review table for the UK LPA for Financial
Decisions. No build step; opens directly in the browser.

See [`../AGENTS.md`](../AGENTS.md) for the form-level agent contract.

## Layout

- `index.html` — review table.
- `css/styles.css` — styling.
- `js/sample-data.js` — fixture LPAs.
- `js/app.js` — table rendering + filter.

## Conventions

- camelCase property names matching the canonical `Lpa` type.
- No build step, no bundler — works by opening `index.html`.
- Alpine.js 3.14.8 via CDN if interactivity is needed.

## Verify

Open `index.html` in a browser; rows render and the filter narrows them.
