# Plan: Provider Transfer Request — consolidated front-end (SvelteKit)

## Current status

Implemented. Consolidated gold-standard `front-end-with-svelte/`:

- SBAR completeness engine in `src/lib/engine/` with Vitest tests.
- Nine step components in `src/lib/components/steps/`.
- Class-based reactive store `src/lib/stores/assessment.svelte.ts` (id-keyed,
  localStorage-persisted, in-place `deepAssign`).
- RESTful routes under `src/routes/provider-transfer-requests/`: dashboard
  (SVAR DataGrid, `ssr = false`), wizard `[id]`, report, and PDF endpoint.
- Welcome page and themed layout (45 Lily themes + ThemeSelect).

## Future work

- Wire the dashboard to the Loco back-end API (currently sample-data fallback).
