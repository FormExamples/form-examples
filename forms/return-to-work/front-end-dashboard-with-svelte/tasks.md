# Tasks: SvelteKit dashboard

## Scaffold
- [ ] `pnpm create svelte@latest`.
- [ ] Install Tailwind CSS 4.
- [ ] Install `@svar-ui/svelte-grid` and the Willow theme.

## Code
- [ ] `lib/types.ts` — TypeScript types matching the FHIR Bundle.
- [ ] `lib/api/client.ts` — API client.
- [ ] `lib/api/sample-data.ts` — fallback data.
- [ ] `lib/components/Dashboard.svelte` — DataGrid wiring.
- [ ] `lib/components/StatusBadge.svelte` — enum badge.
- [ ] `routes/+layout.svelte` and `routes/+page.svelte`.

## QA
- [ ] `pnpm run check`.
- [ ] `pnpm exec vitest run`.
- [ ] Drill-down sheet (deferred).
- [ ] CSV / TSV export (deferred).
