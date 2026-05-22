# UK LPA dashboard — SvelteKit + SVAR DataGrid — Agent Instructions

SvelteKit dashboard with SVAR DataGrid. Displays computed validity status,
fired statutory rules, completeness score, and registration stage per
LPA.

## Files

- `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`
- `src/app.css`, `src/app.html`
- `src/lib/api/lpa.ts` — fetch with sample-data fallback
- `src/lib/data/sample.ts` — seed rows
- `src/lib/components/StatusBadge.svelte` — validity status colour chip
- `src/routes/+layout.svelte`, `+page.svelte` — dashboard
- `src/routes/lpa/[id]/+page.svelte` — single-record drilldown showing
  fired rules and ambiguity flags

## Conventions

- camelCase TypeScript identifiers.
- SVAR DataGrid `@svar-ui/svelte-grid` with the Willow theme.
- Dropdown filters on validity status, registration stage, jurisdiction.
- Sample-data fallback so the dashboard runs without a back-end.
