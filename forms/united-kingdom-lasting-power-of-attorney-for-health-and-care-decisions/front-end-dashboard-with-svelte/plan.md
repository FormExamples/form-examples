# Plan: SvelteKit + SVAR LPA dashboard

## Status

Scaffolded 2026-05-18. No implementation yet.

## Build order

1. [ ] `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`.
2. [ ] Tailwind CSS 4 config, `src/app.css`, `src/app.html`.
3. [ ] Add `@svar-ui/svelte-grid` and the Willow theme.
4. [ ] `src/lib/data/sample.ts` — seed rows covering each validity status.
5. [ ] `src/lib/api/lpa.ts` — fetch with sample-data fallback.
6. [ ] `src/lib/components/StatusBadge.svelte` — validity badge.
7. [ ] `src/routes/+page.svelte` — dashboard with SVAR DataGrid.
8. [ ] `src/routes/lpa/[id]/+page.svelte` — drilldown with fired rules
       and flags table.
9. [ ] Sortable columns; dropdown filters on status, stage, jurisdiction.
10. [ ] Future: column-visibility persistence; user-defined view presets.
