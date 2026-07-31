# Inpatient Clinical Note — SvelteKit front-end plan

- [x] Scaffolded from the consolidated Lily SvelteKit layout.
- [x] Engine ported to TypeScript: `types.ts`, `utils.ts`, `news2.ts`,
      `note-rules.ts`, `acuity.ts`, `note-grader.ts`, `flagged-issues.ts`.
- [x] Vitest engine suite (`note-grader.test.ts`), 29 tests covering the NEWS2
      boundaries, the per-note-type required sets, the acuity worked examples,
      the override rules, the completeness boundaries, and the safety flags.
- [x] Store (`assessment.svelte.ts`) keyed by note id, localStorage persistence,
      `createDefaultAssessment()` delegating to the engine's `emptyAssessment()`.
- [x] Twelve step components, including four backed by repeating child-table
      collections via `RowCard.svelte`.
- [x] Note-type-conditional fields on step 1 (consult, procedure, transfer).
- [x] Live NEWS2 readout on step 4 and live grading on step 12.
- [x] Routes: welcome, wizard, report (both gradings + acuity rule trace), PDF
      endpoint, SVAR dashboard with completeness/acuity/ward filters.
- [x] `pnpm check` clean (0 errors), production build green, all tests passing.

## Deferred

- Wiring `DateTimePicker.svelte` in place of the native
  `<input type="datetime-local">`. It is vendored fleet-wide but deliberately
  unwired, as elsewhere in the monorepo.
- A Playwright pass over the SvelteKit app; the HTML front-end carries the
  fleet e2e sweep today.
