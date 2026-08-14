# Hospital Dashboard Metrics — Agent Instructions

Periodic hospital KPI dashboard: **67 metrics** across 14 departmental
categories. Each metric is a numeric value with an optional note. No
clinical grading engine — this is operational KPI data entry, not a
diagnostic instrument.

See [`index.md`](./index.md) for the full design and the 16-step
wizard table. The 67 metrics are catalogued in
[`spec/index.md`](./spec/index.md), including a documented note that
the 14 category titles are editorially inferred (the source proforma
only separated groups with `---`, without naming most of them).

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./spec/index.md` — the 67-metric catalogue (source text + inferred
  category titles)
- `./doc/` — background reference notes
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR R5 JSON per SQL entity
- `./front-end-with-html/` — single-page HTML wizard (index.html) + dashboard (dashboard.html)
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard
- `./back-end-with-loco/` — Rust backend with a JSON API

## Data model

- **Input shape:** `HospitalDashboardMetrics` TypeScript type: a
  `ReportingPeriod` block (hospital/site name, period month, period
  year, prepared-by name) plus a generic
  `Record<string, MetricResponse>` keyed by metric id (`'1.1'`,
  `'4.3'`, `'14.6'`, …), plus a `Summary` block (overall notes,
  signed-at).
  ```ts
  export interface MetricResponse {
    value: number | null;
    notes: string;
  }
  ```
- **Metric catalogue is data, not TypeScript fields** — see
  `front-end-with-svelte/src/lib/config/metrics.ts` /
  `front-end-with-html/js/metrics.js`, each entry
  `{ id, category, categoryTitle, text }`. This mirrors the
  `hospital-daily-monitoring-checklist` convention (97 items, same
  generic-map pattern) — chosen because 67 metrics across 14
  categories is well past the point where per-metric TypeScript
  fields stay maintainable.
- **Output/summary:**
  ```ts
  summariseMetrics(data: HospitalDashboardMetrics): {
    reportedCount: number;              // 0..67
    categoryCounts: Record<number, { reported: number; total: number }>;
  }
  ```
  Pure function, no side effects. This is a completeness tally, not a
  scored grading engine — there is no pass/fail threshold on any
  metric.
- **Engine files:** `types.ts`, `metrics.ts`, `factory.ts`,
  `summary.ts`.
- **Tests:** `summary.test.ts`.

## Conventions

- `''` for unanswered text fields; `null` for unanswered metric values.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- One wizard step per category: `Step01ReportingPeriod.svelte`,
  `Step02AntibioticsNarcoticsCulture.svelte`, … `Step15FacilitiesBiomedical.svelte`,
  `Step16Summary.svelte` (16 steps total, 1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the
  front-end.
- UUIDv4 primary keys.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.

## SQL shape

Normalized **parent + child** tables (not one wide row per submission
— at 67 metrics a flat table would need over 130 columns):

- `hospital_dashboard_metrics` — one row per reporting period:
  hospital/site name, period month, period year, prepared-by name,
  overall notes, signed-at, status, timestamps.
- `hospital_dashboard_metric_value` — one row per recorded metric:
  `hospital_dashboard_metrics_id` FK, `metric_code` (the dotted id),
  `category_number`, `category_title`, `metric_text`, `metric_value`
  (numeric, nullable), `notes`, timestamps.

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

## Verify

```sh
bin/test-form hospital-dashboard-metrics
```
