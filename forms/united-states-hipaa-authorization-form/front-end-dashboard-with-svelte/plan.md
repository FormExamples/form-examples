# Plan: front-end-dashboard-with-svelte

SvelteKit + SVAR DataGrid review dashboard for HIPAA authorizations.

## Build order

1. [x] Scaffold SvelteKit + TypeScript + Tailwind 4.
2. [x] Install `@svar-ui/svelte-grid` with the Willow theme.
3. [x] `AuthorizationSummary` type and sample data.
4. [x] `src/routes/+page.svelte` with the grid bound to sample data.
5. [x] API client (`src/lib/api/authorizations.ts`).
6. [x] Sortable columns; dropdown filters for validity + purpose.
7. [ ] Click-through to the form route.
8. [ ] CSV / TSV export.
9. [ ] Pagination for large data sets.
