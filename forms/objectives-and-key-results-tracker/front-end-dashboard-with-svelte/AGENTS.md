# Agent notes — Svelte dashboard (SvelteKit)

SvelteKit + Tailwind 4 review dashboard for the OKR tracker. Renders a
sortable, filterable table of objectives with a right-side detail panel.
Sample data is loaded from `static/objectives.json` (copied from the HTML
dashboard sub-project); in Plan 6 the Loco backend replaces the static
fetch.

## Files

- `svelte.config.js` / `vite.config.ts` / `tailwind.config.ts` — toolchain
- `playwright.config.ts` — Vite dev server on port 5173, `testIdAttribute: 'data-test'`
- `src/app.html`, `src/app.css` — app shell, Tailwind import
- `src/routes/+layout.svelte`, `src/routes/+page.svelte` — layout and dashboard composition
- `src/lib/data/sample.ts` — `Objective` / `KeyResult` / `Flag` types and `loadObjectives()`
- `src/lib/components/`
  - `Sidebar.svelte` — filter sidebar (level / RAG / owner), bindable `filters` prop
  - `Grid.svelte` — semantic table with sortable columns and `[data-grid-row]` rows
  - `RagChip.svelte` — RAG cell renderer
  - `DetailPanel.svelte` — right-hand panel with KR progress bars, flags, latest check-in
- `static/objectives.json` — 5 hand-written sample objectives
- `e2e/dashboard.spec.ts` — Playwright tests for filter + sort + row expansion

## Conventions

- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`); no legacy stores
- Tailwind 4 via `@tailwindcss/vite`, `@import 'tailwindcss';` in `app.css`
- Path aliases: `$data` → `src/lib/data`, `$components` → `src/lib/components`
- Grid rows expose `data-grid-row` and `data-id="<obj.id>"` for selection/testing
- The `wx-svelte-grid` dependency is listed for future use; the current Grid is a
  semantic `<table>` (same pattern as the ICVP dashboard) — keeps tests stable and
  avoids fighting the SVAR Grid cell-renderer API

## Parent docs

- [`../AGENTS.md`](../AGENTS.md)
- [Design spec](../../../docs/superpowers/specs/2026-05-08-objectives-and-key-results-tracker-design.md)
- [Svelte-dashboard plan](../../../docs/superpowers/plans/2026-05-10-okr-tracker-plan-5-svelte-dashboard.md)
