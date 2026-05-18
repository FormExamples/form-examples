# ICVP — SvelteKit review dashboard

SvelteKit 2 + Svelte 5 + TypeScript + Tailwind 4 dashboard that displays a
sortable, filterable list of issued ICVP certificates using the SVAR
DataGrid component (`@svar-ui/svelte-grid`, Willow theme).

## Columns

- Certificate serial number
- Vaccinee surname / given names
- Issuing centre
- Primary disease
- Number of entries
- Validity status
- Vaccination date (most recent)
- Status
- Issued at

## Filters

- Disease dropdown
- Status dropdown
- Centre dropdown
- Free-text search

## Stack

- SvelteKit 2.x
- Svelte 5 runes
- TypeScript strict
- Tailwind CSS 4
- `@svar-ui/svelte-grid` with the Willow theme
- Sample-data fallback when no backend is configured

## Running

```sh
pnpm install
pnpm run dev
```

Open <http://localhost:5173> and the dashboard renders with sample data.
