# front-end-dashboard-with-svelte — Agent Instructions

SvelteKit 2 + Svelte 5 + Tailwind 4 dashboard for the ADR register.

## Conventions

- All filtering and sorting logic lives in `src/routes/+page.svelte` using
  Svelte 5 `$state` / `$derived` runes.
- Data access is centralised in `src/lib/api/adrs.ts`. Components import
  `fetchAdrs()` from there; do not call `fetch` directly from a component.
- The `AdrRow` shape is the front-end view of the SQL row — camelCase,
  with `markdownUrl` denormalised in. The conversion happens at the API
  layer; this dashboard does not know about snake_case.
- Read-only by design. There is no "create" or "edit" button. Authoring
  happens in `../front-end-form-with-svelte/`.

## When changing columns

1. Update `AdrRow` in `src/lib/data/sample.ts`.
2. Update the sort-key handling in `+page.svelte` (the `sortKey` type is
   `keyof AdrRow`, so TypeScript will catch most issues).
3. Update the table head and body in `+page.svelte`.

## SVAR DataGrid

`@svar-ui/svelte-grid` is a declared dependency for future use (column
reorder, multi-column sort). The current implementation uses a plain
HTML table. When upgrading, do it in one step — do not run two grids
side by side.
