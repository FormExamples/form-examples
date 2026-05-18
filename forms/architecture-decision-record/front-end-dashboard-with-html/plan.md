# front-end-dashboard-with-html — Plan

Status: implemented 2026-05-08 with sample data.

## Approach

- One page, one table. Sort by clicking column headers; filter by status
  (radio buttons), group (select), and free-text search.
- Source data: `js/data.js` exports `window.ARCHITECTURE_DECISION_RECORDS`.
  In production, this file should be replaced with a generated
  `data/adrs.json` produced by an offline script that joins
  `architecture_decision_record` + `author`.
- No routing. Each row links out to a per-ADR Markdown file via the
  `markdownUrl` field.

## Constraints

- Works from `file://` — classic `<script>` tags, no fetch, no modules.
- No external runtime dependencies.

## Status pill colour palette

- pending — amber
- decided — blue
- approved — green
- superseded — slate
- deprecated — red
