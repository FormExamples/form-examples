# Hospital Performance Indicators — Agent Instructions

Hospital Balanced Scorecard (Kaplan & Norton) KPI report: **50
indicators** across 4 strategic perspectives (Finance, Process,
Learning and Growth, Customer). Each indicator is a numeric value with
an optional note. No clinical grading engine — this is strategic KPI
data entry, not a diagnostic instrument.

See [`index.md`](./index.md) for the full design and the 6-step wizard
table. The 50 indicators are catalogued in
[`spec/index.md`](./spec/index.md).

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./spec/index.md` — the 50-indicator catalogue (source text)
- `./doc/` — background reference notes
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR R5 JSON per SQL entity
- `./front-end-with-html/` — single-page HTML wizard (index.html) + dashboard (dashboard.html)
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard
- `./back-end-with-loco/` — Rust backend with a JSON API

## Data model

- **Input shape:** `HospitalPerformanceIndicators` TypeScript type: a
  `ReportingPeriod` block (hospital/site name, period month, period
  year, prepared-by name) plus a generic
  `Record<string, IndicatorResponse>` keyed by indicator id (`'1.1'`,
  `'2.15'`, `'4.5'`, …), plus a `Summary` block (overall notes,
  signed-at).
  ```ts
  export interface IndicatorResponse {
    value: number | null;
    notes: string;
  }
  ```
- **Indicator catalogue is data, not TypeScript fields** — see
  `front-end-with-svelte/src/lib/config/indicators.ts` /
  `front-end-with-html/js/indicators.js`, each entry
  `{ id, category, categoryTitle, text }`. This mirrors the
  `hospital-dashboard-metrics` convention (67 metrics, same
  generic-map pattern).
- **Output/summary:**
  ```ts
  summariseIndicators(data: HospitalPerformanceIndicators): {
    reportedCount: number;              // 0..50
    categoryCounts: Record<number, { reported: number; total: number }>;
  }
  ```
  Pure function, no side effects. This is a completeness tally, not a
  scored grading engine.
- **Engine files:** `types.ts`, `indicators.ts`, `factory.ts`,
  `summary.ts`.
- **Tests:** `summary.test.ts`.

## Conventions

- `''` for unanswered text fields; `null` for unanswered indicator
  values.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- One wizard step per perspective: `Step01ReportingPeriod.svelte`,
  `Step02Finance.svelte`, `Step03Process.svelte`,
  `Step04LearningAndGrowth.svelte`, `Step05Customer.svelte`,
  `Step06Summary.svelte` (6 steps total, 1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the
  front-end.
- UUIDv4 primary keys.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.

## SQL shape

Normalized **parent + child** tables (not one wide row per submission
— at 50 indicators a flat table would need over 100 columns):

- `hospital_performance_indicators` — one row per reporting period:
  hospital/site name, period month, period year, prepared-by name,
  overall notes, signed-at, status, timestamps.
- `hospital_performance_indicator_value` — one row per recorded
  indicator: `hospital_performance_indicators_id` FK,
  `indicator_code` (the dotted id), `category_number`,
  `category_title`, `indicator_text`, `indicator_value` (numeric,
  nullable), `notes`, timestamps.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for client-side PDF
- Vitest for engine unit tests

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- a JSON API (no server-rendered templates)
- `serde(rename_all = "camelCase")` for front-end interop

## Source grounding

- Kaplan, R. S. & Norton, D. P. *The Balanced Scorecard — Measures
  That Drive Performance*. Harvard Business Review, 1992.
- Kaplan, R. S. & Norton, D. P. *The Balanced Scorecard: Translating
  Strategy into Action*. Harvard Business School Press, 1996.

## Verify

```sh
bin/test-form hospital-performance-indicators
```
