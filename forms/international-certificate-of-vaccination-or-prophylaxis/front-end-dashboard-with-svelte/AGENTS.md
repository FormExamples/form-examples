# ICVP — SvelteKit dashboard — agent instructions

Single-page certificate-review dashboard backed by SVAR DataGrid. Renders a
sortable, filterable table of issued certificates with an expandable detail
row showing the vaccination entries.

## Stack

- SvelteKit 2.x, Svelte 5 runes, TypeScript strict.
- Tailwind CSS 4 with `@import "tailwindcss";` and `@theme`.
- `@svar-ui/svelte-grid` (DataGrid) with the Willow theme; theme CSS is
  imported in `src/app.css`.

## Conventions

- camelCase TypeScript property names matching the SQL columns.
- Sample data in `src/lib/data/sample-certificates.ts` is used when no
  backend is configured.
- Backend API client in `src/lib/api/certificates.ts` with a graceful
  sample-data fallback when `fetch` fails or returns non-OK.
- Grid columns and filters declared in `src/lib/grid/columns.ts`.

## Acceptance

- The dashboard renders the grid with the sample data on `/`.
- At least three sortable columns and at least two dropdown filters wired
  to the grid.
- Selecting a row opens the entries panel.
