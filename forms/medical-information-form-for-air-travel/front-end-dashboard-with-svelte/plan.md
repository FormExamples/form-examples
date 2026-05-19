# Plan — MEDIF front-end dashboard (SvelteKit)

## Phase 1 — Scaffold (done)

- SvelteKit 2.x + Tailwind 4 + TypeScript scaffold.
- `@svar-ui/svelte-grid` dependency declared.
- Sample-data rows representing the major IATA member airlines.

## Phase 2 — Dashboard UI

- `Dashboard.svelte` component wraps SVAR `Grid` with the `Willow` theme.
- Columns: passenger, airline, flight, departure, fitness band, flag count, status.
- Fitness-band filter dropdown on the page route.

## Phase 3 — Backend integration

- Replace sample-data fallback with fetch from `/api/medifs`.
- Add airline filter and departure-date range filter.
- Add row-click handler to navigate to a per-MEDIF detail page.
