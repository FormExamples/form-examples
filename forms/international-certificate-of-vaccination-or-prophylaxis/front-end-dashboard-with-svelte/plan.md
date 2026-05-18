# Plan — ICVP SvelteKit dashboard

## Status: in progress

## Milestones

- [x] Scaffold SvelteKit 2 project
- [x] Tailwind 4 entry (`src/app.css`)
- [x] SVAR DataGrid + Willow theme imported
- [x] Sample data in `src/lib/data/sample-certificates.ts`
- [x] Backend API client with sample-data fallback
      (`src/lib/api/certificates.ts`)
- [x] Grid columns and filter dropdowns
      (`src/lib/grid/columns.ts`, `src/lib/components/Filters.svelte`)
- [ ] Row detail panel showing vaccination entries

## Out of scope

- Authentication
- Bulk export (CSV / XML)
- Live WebSocket updates
