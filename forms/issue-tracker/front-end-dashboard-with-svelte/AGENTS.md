# Issue Tracker — front-end dashboard with SvelteKit

SvelteKit review dashboard backed by SVAR DataGrid (Willow theme),
sortable columns, dropdown filters, and a free-text search across the
chief complaint, symptoms, and diagnosis fields.

## Status

Scaffold only. The Grid wiring, sample-data fallback, and filter chrome
still need to be authored.

## Stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes
- Tailwind CSS 4
- SVAR Svelte Core (Willow theme) + SVAR Svelte DataGrid
- Vite for build

## Conventions

- `Willow` theme wrapper.
- `Grid` columns: composite priority, severity, magnitude, harm,
  failure, MoSCoW, frequency, status, environment, system, assignee,
  reported_at.
- Backend API client with sample-data fallback for offline development.

See [`AGENTS/front-end-with-sveltekit-tailwind-svar.md`](../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md)
for the full conventions.
