# Plan — WHO Surgical Safety Checklist Dashboard (SvelteKit)

## Phase 1 — Scaffold (done)

- [x] SvelteKit 2 + Svelte 5 + Vite 7 + Tailwind 4 + TypeScript project.
- [x] `@svar-ui/svelte-grid` dependency.
- [x] `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `tsconfig.json`,
      `svelte.config.js`, `vite.config.ts`.
- [x] `src/app.css`, `src/app.html`, `src/app.d.ts`.

## Phase 2 — Domain layer (done)

- [x] `src/lib/checklist/types.ts` mirroring the SQL columns.
- [x] `src/lib/checklist/safety-flags.ts` (`computeSafetyFlags`,
      `countPhasesCompleted`).
- [x] `src/lib/data/sample.ts` — 12 sample `ChecklistRow` values across the
      lifecycle (not-started, sign-in-complete, time-out-complete, completed,
      abandoned) with varied safety-flag combinations.
- [x] `src/lib/data/api.ts` — `fetchChecklists()` with sample fallback.

## Phase 3 — UI (done)

- [x] `src/routes/+layout.svelte` — shell, header, imports `app.css`.
- [x] `src/routes/+page.svelte` — SVAR DataGrid + filter panel + drawer.
- [x] Filter panel: status, urgency, specialty `<select>` + free-text search,
      filters compose with AND semantics.
- [x] "Showing X of Y cases" count above the grid.
- [x] Row click opens drawer showing all three phases, per-phase coordinator
      and completed-at timestamps, team roster, and safety flags.

## Phase 4 — Documentation (done)

- [x] `index.md` — purpose, stack, run instructions.
- [x] `AGENTS.md` — data flow, columns, filters, directory map.
- [x] `plan.md` — this file.
- [x] `tasks.md` — short todo list.

## Phase 5 — Future enhancements

- [ ] Wire the dashboard to the Rust backend's
      `/api/dashboard/checklists` endpoint when available.
- [ ] Persist filter state in the URL query string for shareable views.
- [ ] CSV / TSV export of the filtered rows.
- [ ] Per-flag drill-down (group cases by flag code).
- [ ] Date-range filter on `caseDate`.
- [ ] Resolve `signInCoordinatorId` / `timeOutCoordinatorId` /
      `signOutCoordinatorId` to display names via the staff lookup table.
