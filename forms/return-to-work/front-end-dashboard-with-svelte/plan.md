# Plan: SvelteKit dashboard

## Build order

1. [ ] `pnpm create svelte@latest` (TypeScript, ESLint, Prettier,
       Vitest).
2. [ ] Install Tailwind 4 and `@svar-ui/svelte-grid`.
3. [ ] Author `lib/types.ts` matching the FHIR Bundle shape.
4. [ ] Author `lib/api/client.ts` with the sample-data fallback.
5. [ ] Author `lib/components/Dashboard.svelte` with the DataGrid
       wiring.
6. [ ] Author `StatusBadge.svelte` for the enum-typed columns.

## Future enhancements

- Drill-down sheet showing the full statement-of-fitness preview.
- CSV / TSV export.
- Bulk acknowledge / archive actions.
- Server-side pagination for large datasets.
