# Plan: Eye Prescription — SvelteKit Dashboard

## Build order

1. `pnpm create svelte@latest` — SvelteKit 2 + TypeScript + Tailwind 4.
2. Install dependencies: `@svar-ui/svelte-grid`, `wx-svelte-grid` theme
   (Willow).
3. Author `src/lib/types.ts` — re-export from the SvelteKit form types.
4. Author `src/lib/sample-data.ts` — 30+ static prescriptions covering
   all complexity grades, all flag categories.
5. Author `src/lib/api.ts` — fetch from the back-end with a fallback to
   sample data when the back-end is unreachable.
6. Author `src/lib/columns.ts` — DataGrid column definitions.
7. Author `src/lib/components/DashboardGrid.svelte`.
8. Author `src/lib/components/FilterBar.svelte`.
9. Author `src/lib/components/ComplexityBadge.svelte`.
10. Author `src/lib/components/FlagBadge.svelte`.
11. Author `src/routes/+page.svelte` — wire everything together.
12. Author `src/routes/[id]/+page.svelte` — detail view.
13. `pnpm run check` passes.

## Design principles

- One DataGrid; no pagination at the back-end (paginate in the grid).
- Default sort: issue date descending.
- Click row → detail view with full FHIR Bundle rendered side-by-side.
- Colour code complexity (green / amber / red) and expired (red).

## Out of scope (deferred)

- Side-by-side prior-vs-current comparison view.
- CSV export.
- Bulk operations (mark superseded, mark cancelled).
