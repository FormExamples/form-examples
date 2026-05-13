# Agile Consulting Scorecard for Hiring Help — front-end dashboard with HTML

Static HTML mirror of the SvelteKit reviewer dashboard. Renders submitted
scorecards in a sortable, filterable HTML table. No JavaScript framework
required.

## Status

Scaffold only. The dashboard table, sample-data loader, and inline
sort/filter scripts still need to be authored.

## Stack

- Plain HTML5 + a single `<table>`
- Vanilla JavaScript for column sort and dropdown filter
- Tailwind CSS via CDN (or the precompiled stylesheet from the SvelteKit
  build, copied into `assets/`)
- No build step required

## Columns

Same 11 columns as the SvelteKit dashboard (organization, sector, size
band, respondent, assessment date, score 0-16, manifesto subtotal,
principles subtotal, band, flags, recommendation).

## Conventions

- Single `<table>` with `<thead>` filter row and `<tbody>` data rows.
- Sample data loaded from `assets/sample-scorecards.json` so the page
  works without a backend.
- Row click navigates to a static `/report/{id}.html` page (planned).
