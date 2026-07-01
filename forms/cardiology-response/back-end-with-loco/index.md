# Cardiology Response — Rust axum + Loco JSON API

Pure JSON API back-end for the Cardiology Response (consult reply), built with
axum + Loco + SeaORM + PostgreSQL. No HTML rendering, no Tera, no HTMX, no
Alpine.js, no CSS.

## Four-axis interpretation engine

The `src/engine/` module ports the SvelteKit grading engine
(`front-end-with-svelte/src/lib/engine/`) to Rust with identical rule IDs,
flag IDs, axis names, bands, and thresholds:

- Axis A — response classification: `no-abnormality` / `cardiac-condition` /
  `critical` / `inconclusive` (`classification_rules.rs`, `R-CLASS-*`).
- Axis B — condition severity: `none` / `minor` / `moderate` / `major` plus a
  structured-finding `severityCategory` (`severity_rules.rs`, `R-SEVERITY-*`).
- Axis C — response completeness percent 0–100 over five mandatory sections
  (`completeness_rules.rs`, `R-COMP-*`).
- Axis D — follow-up urgency: `routine` / `recommended` / `urgent` /
  `critical-alert` plus `targetTimeframe` and `recommendedAction`
  (`follow_up_rules.rs`, `R-FOLLOWUP-*`).
- Overall recommendation: `no-action` / `routine-follow-up` /
  `further-investigation` / `specialist-management` / `urgent-review`.
- Safety flags across seven categories with `F-*` IDs (`flagged_issues.rs`).

A critical result auto-escalates Axis D to `critical-alert` and raises the
`critical-finding` flag, regardless of the other axes.

## JSON API

| Method | Route                                   | Purpose                                           |
| ------ | --------------------------------------- | ------------------------------------------------- |
| GET    | `/api/cardiology_responses`             | List responses (most recent first)                |
| POST   | `/api/cardiology_responses`             | Create a response (draft or filled)               |
| GET    | `/api/cardiology_responses/{id}`        | Return the response record                        |
| PATCH  | `/api/cardiology_responses/{id}`        | Overwrite the response payload fields             |
| DELETE | `/api/cardiology_responses/{id}`        | Soft-delete the response                          |
| POST   | `/api/cardiology_responses/{id}/submit` | Run the engine, persist the grade transactionally |
| GET    | `/api/cardiology_responses/{id}/result` | Return the stored grade + fired rules + flags     |
| GET    | `/api/dashboard`                        | List graded responses, grade joined to response   |

All request and response bodies are `application/json` with camelCase keys via
`serde(rename_all = "camelCase")`.

## Database

The schema is **relational**, mirroring the form's `sql/` source of truth one
table per Loco migration / SeaORM entity:

- `users` — the Loco-default authentication table (verbatim default).
- `patients` — patient demographics.
- `clinicians` — responding cardiology clinician.
- `cardiology_responses` — the source-of-truth response record; FKs to
  `patients` and `clinicians`.
- `cardiology_response_grades` — the computed four-axis grade, 1:1 with the
  response (unique FK).
- `cardiology_response_grade_rules` — one row per fired rule (audit trail), FK
  to the grade.
- `cardiology_response_grade_flags` — one row per safety flag, FK to the grade.

Following the `medical-operation-note` template, primary keys are
auto-increment integers and `created_at` / `updated_at` are added automatically
by Loco's `create_table` helper; every table also carries `deleted_at` for
soft-deletes. `POST .../submit` runs the engine and persists the grade plus its
rule and flag rows inside a single transaction; re-submitting replaces the prior
grade idempotently.

## Tests

`tests/engine/` ports the Svelte `grader.test.ts` suite (grading + flag
detection) to Rust. Run with `cargo test`.
