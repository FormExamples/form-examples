# Tasks — WHO Surgical Safety Checklist Dashboard

## Done

- [x] Scaffold SvelteKit 2 + Svelte 5 + Tailwind 4 + TypeScript project.
- [x] Add `@svar-ui/svelte-grid` dependency.
- [x] Define `ChecklistRow`, `WhoSurgicalSafetyChecklist`, `TeamMember`,
      `SafetyFlag` types.
- [x] Implement `computeSafetyFlags` and `countPhasesCompleted`.
- [x] Bundle 12 sample checklists spanning the lifecycle and flag mix.
- [x] Implement `fetchChecklists()` with sample fallback.
- [x] Author `src/routes/+layout.svelte` with the page shell.
- [x] Author `src/routes/+page.svelte` with SVAR Grid (Willow theme).
- [x] Add status, urgency, specialty `<select>` filters and a free-text
      search input.
- [x] Compose filters with AND semantics.
- [x] Show "Showing X of Y cases" count.
- [x] Implement row-click drawer with per-phase coordinator + completed-at
      timestamp, team roster, and computed safety flags.
- [x] Write `index.md`, `AGENTS.md`, `plan.md`, `tasks.md`.

## Todo

- [ ] Wire to the live `/api/dashboard/checklists` backend endpoint.
- [ ] Persist filter state in the URL query string.
- [ ] CSV / TSV export of the filtered grid.
- [ ] Per-flag drill-down view.
- [ ] Date-range filter on case date.
- [ ] Resolve coordinator IDs to display names from a staff directory.
- [ ] Add `pnpm run check` to CI.
