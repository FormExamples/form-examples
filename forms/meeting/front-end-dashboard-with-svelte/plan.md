# Plan: Meeting — Front-end Dashboard (SvelteKit)

## Current status

Scaffolded 2026-05-13. Implementation deferred — requires `pnpm install`.
`tasks.md` tracks the remaining build steps.

## Goal

A SvelteKit dashboard that lists meetings via SVAR DataGrid with
sortable columns, dropdown filters, and a backend API client that
gracefully falls back to bundled sample data.

## Build order

1. `pnpm create svelte@latest .` with TypeScript + Tailwind.
2. Install `@svar-ui/svelte-grid` and pull in the Willow theme.
3. Configure Tailwind CSS 4 with the monorepo `@theme` tokens.
4. Author `src/lib/types.ts` mirroring the meeting type model.
5. Author `src/lib/api.ts` — fetch from `/api/meetings`, fall back to
   `sample.json` on error.
6. Author `src/lib/columns.ts` — SVAR column definitions for title,
   category, status, scheduled start, participants, fired rules, result.
7. Author `src/routes/+page.svelte` — DataGrid mount, filter bar, search
   field.
8. Wire row click to deep-link the SvelteKit front-end form.
9. Run `bin/test-form meeting`.

## Design principles

- SVAR DataGrid Willow theme for visual consistency with the other
  monorepo dashboards.
- Sample-data fallback so the dashboard is usable when the backend is
  offline.
- camelCase property names matching `serde(rename_all = "camelCase")` on
  the Rust side.
