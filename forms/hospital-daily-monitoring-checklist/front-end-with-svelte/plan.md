# Hospital Daily Monitoring Checklist — SvelteKit Form Plan

## Goal

A 24-step single-page SvelteKit wizard that collects 97 checkpoint
answers (satisfactory / needs-attention / not-applicable, plus optional
remarks) across 22 hospital areas, tallies checkpoints answered and
needs-attention checkpoints by area, and renders a printable report
(PDF via `pdfmake`) plus a review dashboard (SVAR DataGrid).

## Build order

1. Scaffold SvelteKit 2 + TypeScript + Tailwind 4 project (consolidated
   `front-end-with-svelte/`, RESTful routes under
   `src/routes/hospital-daily-monitoring-checklist/`).
2. Encode the 97 checkpoints in `src/lib/config/items.ts`, transcribed
   from `../spec/index.md`.
3. Implement the engine: `types.ts`, `factory.ts`, `summary.ts`
   (`summariseChecklist()` — a pure tally, not a scored grading engine).
4. Vitest unit tests covering zero-answered, all-satisfactory, mixed
   needs-attention, and not-applicable exclusion.
5. Wizard UI: `Step01InspectionDetails.svelte`, 22 per-area step
   components (`Step02Opd.svelte` … `Step23RecordRoom.svelte`), and
   `Step24Summary.svelte`, each per-area step iterating that section's
   checkpoints with a Lily `RadioGroup` (satisfactory / needs-attention /
   not-applicable) plus a remarks `TextInput`.
6. Report page with needs-attention tally, per-area breakdown, and
   per-checkpoint answers.
7. PDF export via `pdfmake`.
8. LocalStorage autosave + draft recovery, keyed by round id.
9. Administrator review dashboard (SVAR DataGrid) with hospital and
   needs-attention filters.

## Status

Complete — 24-step wizard, engine + tests, report, PDF export, dashboard,
and welcome page all built. See `tasks.md` for the itemised checklist and
verification results.
