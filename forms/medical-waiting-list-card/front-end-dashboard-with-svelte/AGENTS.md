# Medical Waiting List Card — SvelteKit dashboard

SvelteKit 2.x + SVAR DataGrid review dashboard for booking-office staff
and RTT validators. See [`index.md`](./index.md) for the column and filter
list and the form-level [`../AGENTS.md`](../AGENTS.md) for the data model.

## Stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes
- Tailwind CSS 4
- `@svar-ui/svelte-grid` with the Willow theme

## Conventions

- Sortable columns, dropdown filters on specialty, clinical priority,
  and Waiting Time Status.
- Backend API client with sample-data fallback for standalone development.
- camelCase TypeScript property names mirroring the backend serde.
