# Hospital Daily Monitoring Checklist — Agent Instructions

Operational rounds checklist that audits **97 checkpoints** organized
in 22 hospital areas. Each checkpoint is answered **satisfactory /
needs-attention / not-applicable**, with an optional remark. There is
no clinical grading engine — this is a facility/operations audit, not
a diagnostic instrument.

See [`index.md`](./index.md) for the full design and the 24-step
wizard table. The 97 checkpoints are catalogued verbatim (from the
source proforma) in [`spec/index.md`](./spec/index.md).

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./spec/index.md` — the 97-checkpoint catalogue (source text)
- `./doc/` — background reference notes
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR R5 JSON per SQL entity
- `./front-end-with-html/` — single-page HTML wizard (index.html) + dashboard (dashboard.html)
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard
- `./back-end-with-loco/` — Rust backend with a JSON API

## Data model

- **Input shape:** `HospitalDailyMonitoringChecklist` TypeScript type:
  an `InspectionDetails` block (hospital name, department, inspection
  date, inspecting officer name & designation) plus a generic
  `Record<string, ChecklistItemResponse>` keyed by checkpoint id
  (`'1.1'`, `'6.1.1'`, `'20.10'`, `'15'`, …), plus a `Summary` block
  (overall notes, action plan, signed-at).
  ```ts
  export type ChecklistStatus = 'satisfactory' | 'needs-attention' | 'not-applicable' | '';
  export interface ChecklistItemResponse {
    status: ChecklistStatus;
    remarks: string;
  }
  ```
- **Item catalogue is data, not TypeScript fields** — see
  `front-end-with-svelte/src/lib/config/items.ts` /
  `front-end-with-html/js/items.js`, each entry
  `{ id, section, sectionTitle, subsection?, text }`. This mirrors the
  `agile-checklist` convention (57 items, same generic-map pattern) —
  chosen over one-named-field-per-item because 97 items is well past
  the point where per-item TypeScript fields stay maintainable.
- **Output/summary:**
  ```ts
  summariseChecklist(data: HospitalDailyMonitoringChecklist): {
    answeredCount: number;             // 0..97
    needsAttentionCount: number;
    needsAttentionItems: { id: string; sectionTitle: string; text: string; remarks: string }[];
    sectionsWithNeedsAttention: number[]; // section numbers 1..22
  }
  ```
  Pure function, no side effects. This is a tally/summary, not a
  scored grading engine.
- **Engine files:** `types.ts`, `items.ts`, `factory.ts`,
  `summary.ts`.
- **Tests:** `summary.test.ts`.

## Conventions

- `''` for unanswered status; `''` for unanswered remarks.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- One wizard step per area: `Step01InspectionDetails.svelte`,
  `Step02Opd.svelte`, `Step03Causality.svelte`, … `Step23RecordRoom.svelte`,
  `Step24Summary.svelte` (24 steps total, 1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the
  front-end.
- UUIDv4 primary keys.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.

## SQL shape

Normalized **parent + child** tables (not one wide row per submission
— at 97 checkpoints a flat table would need ~200 columns):

- `hospital_daily_monitoring_checklists` — one row per inspection
  round: hospital name, department, inspection date, inspecting
  officer name/designation, overall notes, action plan, signed-at,
  status, timestamps.
- `hospital_daily_monitoring_checklist_items` — one row per answered
  checkpoint: `checklist_id` FK, `item_code` (the dotted id),
  `section_number`, `section_title`, `item_text`, `status`, `remarks`,
  timestamps.

This matches the repo's relational-schema convention (one migration +
one entity per SQL table; see `medical-operation-note` as the
reference relational back-end) rather than agile-checklist's flat
named-column table, because 97 checkpoints makes a normalized child
table the maintainable choice.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for client-side PDF
- Vitest for engine unit tests

## Dashboard stack

- SvelteKit + TypeScript table.
- Sortable columns, dropdown filters (needs-attention count,
  department, inspection date).
- Backend API client with sample-data fallback for standalone
  development.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- a JSON API (no server-rendered templates)
- `serde(rename_all = "camelCase")` for front-end interop

## Verify

```sh
bin/test-form hospital-daily-monitoring-checklist
```
