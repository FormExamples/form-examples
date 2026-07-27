# Hospital Daily Monitoring Checklist — SvelteKit Form Tasks

## Done

- [x] Scaffold consolidated SvelteKit 2 + TypeScript + Tailwind 4 project
      (RESTful routes under `src/routes/hospital-daily-monitoring-checklist/`)
- [x] Encode all 97 checkpoints in `src/lib/config/items.ts`, transcribed
      verbatim from `../spec/index.md`, with `SECTIONS` derived (22 areas)
- [x] Engine `types.ts`, `factory.ts` (`createEmptyAssessment()`)
- [x] Engine `summary.ts` (`summariseChecklist()` — pure tally, no grading
      engine: answered count, needs-attention count/list, sections affected)
- [x] Vitest unit tests (`summary.test.ts`): zero-answered, all-satisfactory,
      mixed needs-attention (tally + list correctness), not-applicable
      exclusion — 4/4 passing
- [x] `Step01InspectionDetails.svelte`
- [x] `Step02Opd.svelte` … `Step23RecordRoom.svelte` — 22 per-area steps,
      each iterating that section's checkpoints from `CHECKLIST_ITEMS` via
      `{#each}` (no hand-written per-item bindings), rendering a Lily
      `RadioGroup` (satisfactory / needs-attention / not-applicable) plus a
      remarks `TextInput` per checkpoint (`ItemRow.svelte`); Diagnostic
      Facility (step 7) renders its `6.1 Pathology Lab` / `6.2 Radio Imaging`
      subsection headings
- [x] `Step24Summary.svelte` with needs-attention tally/list, overall notes,
      action plan, sign-off date
- [x] `config/steps.ts` — 24 `StepDef` entries
- [x] `[id]/+page.svelte` — 24-step wizard, `{#each stepComponents as
      StepComponent, i (i)}` auto-wrapped step rendering, Lily
      Progress/StepList/ErrorSummary, localStorage-backed store
      (`assessment.svelte.ts`)
- [x] `hospital-daily-monitoring-checklists/` dashboard (SVAR DataGrid) with
      hospital and needs-attention filters, 4 sample inspection rounds
- [x] `[id]/report/+page.svelte` — needs-attention tally banner, inspection
      details, needs-attention table, overall notes/action plan, full
      per-checkpoint answers grouped by area
- [x] `report/pdf/+server.ts` + `pdf-builder.ts` — `pdfmake` PDF export
- [x] Welcome page (`/hospital-daily-monitoring-checklist/`) with links to
      the wizard and dashboard, and a detailed explanation
- [x] `npx svelte-kit sync && npx svelte-check` — 0 errors, 4 pre-existing
      a11y warnings in the vendored Lily picker components (LocalePicker,
      SharePicker, TextSizePicker, ThemePicker), identical to every other
      form in the monorepo
- [x] `npx vitest run` — 4/4 tests passing
- [x] Playwright smoke test of `/hospital-daily-monitoring-checklist/hospital-daily-monitoring-checklists/new`:
      24 fieldset legends, 24 step-list items, 97 item rows, 97 radio
      groups, zero console errors; interactive check that marking a
      checkpoint needs-attention with a remark updates the Step 24 summary
      tally live; dashboard and welcome routes also verified with
      screenshots

## Pending

(none for this subproject)
