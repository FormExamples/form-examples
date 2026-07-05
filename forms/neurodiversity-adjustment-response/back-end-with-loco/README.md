# Neurodiversity Adjustment Response — Rust axum + Loco JSON API

Pure JSON API back-end for the Neurodiversity Adjustment Response (a UK
workplace reasonable-adjustments employer response — not a clinical form), built
with axum + Loco + SeaORM + PostgreSQL. No HTML rendering, no Tera, no HTMX, no
Alpine.js, no CSS.

## Four-axis grading engine

The `src/engine/` module ports the SvelteKit grading engine
(`front-end-with-svelte/src/lib/engine/`) to Rust with identical rule IDs,
flag IDs, axis names, bands, and thresholds:

- Axis A — outcome classification: `fully-agreed` / `partially-agreed` /
  `alternative-offered` / `declined` / `deferred` (`outcome_rules.rs`,
  `R-OUTCOME-*`).
- Axis B — legal / discrimination risk (reasonableness): `ok` / `caution` /
  `high-risk` (`legal_risk_rules.rs`, `R-LEGAL-*`).
- Axis C — response completeness percent 0–100 over ten weighted mandatory
  sections (`completeness_rules.rs`, `R-COMPLETE-*`).
- Axis D — follow-up / review urgency: `none` / `review-scheduled` /
  `urgent-review` / `escalation-needed` plus `targetTimeframe`
  (`follow_up_rules.rs`, `R-FOLLOWUP-*`).
- Overall recommendation: `implement` / `schedule-review` /
  `seek-occupational-health` / `reconsider-decision` / `escalate-to-hr`.
- Compliance / risk flags across eight categories with `F-*` IDs
  (`flagged_issues.rs`).

Declining adjustments for a worker likely covered by the Equality Act 2010
without an adequate reasonableness justification or alternatives drives Axis B
to `high-risk`, raises the `F-DISCRIMINATION-RISK-001` flag, and auto-escalates
Axis D, regardless of the other axes.

## JSON API

| Method | Route                                                  | Purpose                                           |
| ------ | ------------------------------------------------------ | ------------------------------------------------- |
| GET    | `/api/neurodiversity_adjustment_responses`             | List responses (most recent first)                |
| POST   | `/api/neurodiversity_adjustment_responses`             | Create a response (draft or filled)               |
| GET    | `/api/neurodiversity_adjustment_responses/{id}`        | Return the response record                        |
| PATCH  | `/api/neurodiversity_adjustment_responses/{id}`        | Overwrite the response payload fields             |
| DELETE | `/api/neurodiversity_adjustment_responses/{id}`        | Soft-delete the response                          |
| POST   | `/api/neurodiversity_adjustment_responses/{id}/submit` | Run the engine, persist the grade transactionally |
| GET    | `/api/neurodiversity_adjustment_responses/{id}/result` | Return the stored grade + fired rules + flags     |
| GET    | `/api/dashboard`                                       | List graded responses, grade joined to response   |

All request and response bodies are `application/json` with camelCase keys via
`serde(rename_all = "camelCase")`.

## Database

The schema is **relational**, mirroring the form's `sql/` source of truth one
table per Loco migration / SeaORM entity:

- `users` — the Loco-default authentication table (verbatim default).
- `workers` — worker (neurodivergent employee) demographics.
- `managers` — manager / HR contact (decision-maker).
- `neurodiversity_adjustment_responses` — the source-of-truth response record;
  FKs to `workers` and `managers`.
- `neurodiversity_adjustment_response_grades` — the computed four-axis grade,
  1:1 with the response (unique FK).
- `neurodiversity_adjustment_response_grade_rules` — one row per fired rule
  (audit trail), FK to the grade.
- `neurodiversity_adjustment_response_grade_flags` — one row per compliance /
  risk flag, FK to the grade.

Primary keys are UUIDv4 (`gen_random_uuid()`); every table carries `created_at`
/ `updated_at` / `deleted_at`. `POST .../submit` runs the engine and persists
the grade plus its rule and flag rows inside a single transaction;
re-submitting replaces the prior grade idempotently.

## Tests

`tests/engine/` holds the pure four-axis grading + flag-detection tests. Run
with `cargo test`.
