# Hospital Performance Indicators — SvelteKit Form Tasks

## Done

- [x] Scaffold consolidated SvelteKit 2 + TypeScript + Tailwind 4 project
      (RESTful routes under `src/routes/hospital-performance-indicators/`)
- [x] Encode all 50 indicators in `src/lib/config/indicators.ts`,
      transcribed verbatim from `../spec/index.md`, with `CATEGORIES`
      derived (4 Balanced Scorecard perspectives)
- [x] Engine `types.ts`, `factory.ts` (`createEmptyIndicators()`)
- [x] Engine `summary.ts` (`summariseIndicators()` — pure completeness
      tally, no grading engine: reported count, per-perspective counts)
- [x] Vitest unit tests (`summary.test.ts`): zero recorded, all recorded,
      partial recorded per perspective — 3/3 passing
- [x] `Step01ReportingPeriod.svelte`
- [x] `Step02Finance.svelte` (9), `Step03Process.svelte` (28),
      `Step04LearningAndGrowth.svelte` (8), `Step05Customer.svelte` (5) —
      each iterating that perspective's indicators from
      `PERFORMANCE_INDICATORS` via `{#each}` (no hand-written per-item
      bindings), rendering a Lily `NumberInput` (value) + `TextInput`
      (notes) per indicator (`IndicatorRow.svelte`)
- [x] `Step06Summary.svelte` with reported-count tally/list by perspective,
      overall notes, sign-off date
- [x] `config/steps.ts` — 6 `StepDef` entries
- [x] `[id]/+page.svelte` — 6-step wizard, `{#each stepComponents as
      StepComponent, i (i)}` auto-wrapped step rendering, Lily
      Progress/StepList/ErrorSummary, localStorage-backed store
      (`indicators.svelte.ts`)
- [x] `hospital-performance-indicator-reports/` dashboard (SVAR DataGrid)
      with hospital and completeness filters, 4 sample reporting periods
- [x] `[id]/report/+page.svelte` — indicators-recorded tally banner,
      reporting-period details, recorded-by-perspective table, overall
      notes/sign-off, full per-indicator values grouped by perspective
- [x] `report/pdf/+server.ts` + `pdf-builder.ts` — `pdfmake` PDF export
- [x] Welcome page (`/hospital-performance-indicators/`) with links to the
      wizard and dashboard, and a detailed explanation citing Kaplan &
      Norton
- [x] Cleaned up a directory-copy mistake: this `front-end-with-svelte/`
      had been fully populated with `hospital-daily-monitoring-checklist`
      content (24-step checklist steps, `items.ts`, `ItemRow.svelte`,
      wrong routes, wrong `package.json` name, wrong root redirect) —
      removed and rebuilt from scratch against this form's own spec/SQL
- [x] `npx svelte-kit sync && npx svelte-check` — 0 errors, 4 pre-existing
      a11y warnings in the vendored Lily chooser components (LocaleChooser,
      ShareChooser, TextSizeChooser, ThemeChooser), identical to every other
      form in the monorepo
- [x] `npx vitest run` — 3/3 tests passing
- [x] Playwright smoke test of `/hospital-performance-indicators/hospital-performance-indicator-reports/new`:
      6 fieldset legends, 50 indicator rows (9 + 28 + 8 + 5), zero console
      errors on welcome/dashboard/wizard/report pages; filled reporting
      period + 3 indicator values, submitted, confirmed the report page
      showed "3 of 50 indicators recorded"; dashboard verified with 4
      sample reporting periods and correct per-row tallies (50/50, 46/50,
      25/50, 0/50)
- [x] `bin/lily-svelte-refactor --check hospital-performance-indicators` —
      0 risky lines

## Pending

(none for this subproject)
