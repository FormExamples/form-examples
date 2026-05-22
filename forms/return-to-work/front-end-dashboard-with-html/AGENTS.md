# Return to Work — static HTML dashboard Agent Instructions

Plain-HTML alternative to the SvelteKit dashboard. See
[`index.md`](./index.md) for the column layout.

## Stack

- Single-file HTML5.
- Tailwind CSS 4 via CDN.
- Alpine.js 3.14.8 for the filter / sort interactions.

## API contract

`GET /api/v1/return-to-work?status=submitted&limit=100` returns
JSON in the FHIR Bundle shape. The dashboard renders a flat row per
`return_to_work` entry plus a sparkline of `flag_count`.

## Conventions

- camelCase JSON property names.
- Sample data lives in `js/sample-data.js` for standalone preview.
