# Tasks: SvelteKit + SVAR LPA dashboard

- [x] `package.json` with SvelteKit 2, Svelte 5, Tailwind 4,
      `@svar-ui/svelte-grid`.
- [x] `svelte.config.js` + `vite.config.ts` + `tsconfig.json`.
- [x] `src/app.html`, `src/app.css`, `src/app.d.ts`.
- [x] `src/lib/data/sample.ts` — fallback rows (5 LPAs across all statuses).
- [x] `src/lib/api/lpa.ts` — fetch wrapper with sample fallback.
- [x] `src/lib/components/StatusBadge.svelte`.
- [x] `src/routes/+layout.svelte`, `+page.svelte` — dashboard.
- [x] `src/routes/lpa/[id]/+page.svelte` — drilldown with fired-rules list.
- [x] Dropdown filters on validity status, registration stage, jurisdiction.
- [x] Sortable columns via click-to-sort headers.
- [ ] SVAR DataGrid Willow theme imported and configured
      (currently uses a vanilla `<table>` mirroring the canonical pattern).
- [ ] Manual smoke test against the Loco back-end.
- [ ] Persisted column-visibility (deferred).
