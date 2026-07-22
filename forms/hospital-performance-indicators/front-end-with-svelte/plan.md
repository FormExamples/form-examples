# Hospital Performance Indicators — SvelteKit Form Plan

## Goal

A 6-step single-page SvelteKit wizard that collects 50 Balanced
Scorecard indicator values (Kaplan & Norton) across 4 strategic
perspectives — Finance (9), Process (28), Learning and Growth (8),
Customer (5) — each as a numeric value with an optional note, tallies
indicators reported per perspective, and renders a printable report
(PDF via `pdfmake`) plus an administrator review dashboard (SVAR
DataGrid).

## Build order

1. Scaffold SvelteKit 2 + TypeScript + Tailwind 4 project (consolidated
   `front-end-with-svelte/`, RESTful routes under
   `src/routes/hospital-performance-indicators/`).
2. Encode the 50 indicators in `src/lib/config/indicators.ts`,
   transcribed verbatim from `../spec/index.md`, with `CATEGORIES`
   derived (4 perspectives).
3. Implement the engine: `types.ts`, `factory.ts`, `summary.ts`
   (`summariseIndicators()` — a pure completeness tally, not a scored
   grading engine).
4. Vitest unit tests covering zero recorded, all recorded, and partial
   recorded per perspective.
5. Wizard UI: `Step01ReportingPeriod.svelte`, one step per perspective
   (`Step02Finance.svelte`, `Step03Process.svelte`,
   `Step04LearningAndGrowth.svelte`, `Step05Customer.svelte`), and
   `Step06Summary.svelte`, each perspective step iterating that
   category's indicators via `{#each}` (never hand-written) with a
   Lily `NumberInput` (value) + `TextInput` (notes) per indicator
   (`IndicatorRow.svelte`).
6. Report page with reported-indicator tally, per-perspective
   breakdown, and per-indicator values.
7. PDF export via `pdfmake`.
8. LocalStorage autosave + draft recovery, keyed by report id.
9. Administrator review dashboard (SVAR DataGrid) with hospital and
   completeness filters.

## Status

Complete — 6-step wizard, engine + tests, report, PDF export,
dashboard, and welcome page all built. See `tasks.md` for the itemised
checklist and verification results.
