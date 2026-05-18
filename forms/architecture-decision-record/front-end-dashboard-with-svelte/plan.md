# front-end-dashboard-with-svelte — Plan

Status: implemented 2026-05-10 with sample data.

## Approach

- Single-page SvelteKit dashboard at `/`.
- Plain HTML table with Svelte 5 reactivity for sort, filter, and search.
  No SVAR DataGrid in the initial implementation — it is declared as a
  dependency for future use, but the table is small enough that a
  hand-rolled grid is faster to ship and cheaper to maintain.
- Status pill rendered with Tailwind colour classes keyed off the status
  enum.
- Data source: `fetchAdrs()` tries `/api/adrs` and falls back to the
  compiled-in sample.

## Notes

- The pre-op dashboard in this repo follows the same shape (declares SVAR
  Svelte Grid as a dependency but uses a plain table). This dashboard
  matches that pattern so future grid upgrades happen in lock-step.
- Row click opens `markdownUrl` in a new tab. A future iteration could
  route to `/[slug]` and render Markdown inline.
