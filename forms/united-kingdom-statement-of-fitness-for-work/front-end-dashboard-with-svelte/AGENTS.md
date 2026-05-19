# UK Fit Note SvelteKit Dashboard — Agent Instructions

SvelteKit dashboard with SVAR DataGrid for reviewing UK Statement of Fitness
for Work (Med 3 / fit note) submissions. Displays computed fitness category,
adaptation intensity, period compliance, recommendation, and safety-flag
count per fit note.

## Stack

- SvelteKit 2, Svelte 5 runes only.
- TypeScript with camelCase field names.
- Tailwind CSS 4.
- SVAR DataGrid (`@svar-ui/svelte-grid`) — Willow theme.

## Files

- `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`,
  `.gitignore`.
- `src/app.css` (Tailwind import + NHS palette tokens), `src/app.html`,
  `src/app.d.ts`.
- `src/lib/types.ts` — `FitNoteSummary` interface plus enum string literal
  types for the grade fields.
- `src/lib/sample-data.ts` — twelve realistic records.
- `src/lib/components/SummaryCards.svelte` — count by recommendation.
- `src/routes/+layout.svelte`, `src/routes/+page.svelte` — full dashboard
  with SVAR Grid, sortable columns, dropdown filters, summary cards.

## Conventions

- Svelte 5 runes only (`$state`, `$derived`, `$props`).
- camelCase TypeScript field names.
- NHS palette: NHS Blue `#005eb8`, NHS Warm Yellow `#ffb81c`.
- Recommendation enums mirror the SQL `recommendation` column.

## Verify

```sh
pnpm install
pnpm run check
```
