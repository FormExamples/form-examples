# Issue Tracker — front-end dashboard with HTML

Static review dashboard for an issue-tracker corpus, built with plain
HTML, CSS, and a small amount of vanilla JavaScript.

## Status

Scaffold only. The sortable / filterable HTML table still needs to be
authored.

## Conventions

- One `index.html` containing the full review table.
- Sortable columns and dropdown filters by composite priority,
  severity, harm, failure-condition, environment, system, and assignee.
- No bundler. Plain CSS.

## Verify

Open `index.html` in a browser, sort and filter the table.

## Lily Design System HTML headless

This dashboard conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) §3
(`.data-table-*` family) for the shared vocabulary, filter shape
(`.text-input`, `.select`), and `.alert[data-type]` status messages.
