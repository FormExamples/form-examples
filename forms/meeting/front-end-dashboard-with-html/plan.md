# Plan: Meeting — Front-end Dashboard (HTML)

## Current status

Scaffolded 2026-05-13. Implementation deferred — `tasks.md` tracks the
remaining build steps.

## Goal

A self-contained `index.html` that lists meetings as a sortable,
filterable table and links each row to the front-end form for editing.

## Build order

1. Author `styles.css` — table, filter bar, status badges.
2. Author `app.js` — fetch `sample.json`, render rows, wire sort and
   filter handlers.
3. Author `index.html` — table head, filter bar, empty state.
4. Author `sample.json` — five to ten realistic meetings spanning every
   status and result.
5. Run `bin/test-form meeting`.

## Design principles

- No build step.
- Sortable columns with a stable secondary sort by `scheduled_start_at`.
- Status, category, and result filters as dropdowns.
- Free-text search over `title` with debounced input.
- The table degrades gracefully when `fetch()` fails — sample-data
  fallback is bundled.
