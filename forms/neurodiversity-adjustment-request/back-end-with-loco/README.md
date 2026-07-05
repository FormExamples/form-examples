# Neurodiversity Adjustment Request — Rust axum + Loco JSON API

Pure JSON API back-end for the Neurodiversity Adjustment Request form (a UK
workplace reasonable-adjustments request for neurodiversity — **not clinical**),
built with axum + Loco + SeaORM + PostgreSQL. No HTML, no Tera, no HTMX, no
Alpine.js, no CSS.

## Engine

`src/engine/` is a one-to-one Rust port of
`../front-end-with-svelte/src/lib/engine/`. The four axes:

- **A eligibility** — `likely-covered` / `possibly-covered` / `unclear`
  (Equality Act 2010 disability test)
- **B impact / wellbeing** — `ok` / `caution` / `high-risk`
- **C completeness** — weighted 0–100
- **D priority** — `routine` / `soon` / `urgent` + target timeframe

Plus an overall recommendation (`progress-to-meeting` /
`seek-occupational-health` / `request-more-detail` / `signpost-access-to-work`),
the fired-rule audit trail, and compliance / wellbeing flags. Rule IDs (`R-*`),
flag IDs (`F-*`), axis names, bands, thresholds, and firing order are identical
to the front-end engine. A worker at risk of sickness absence or burnout drives
the impact axis and auto-escalates the priority tier.

## JSON API

| Method | Route                                                 | Purpose                                                           |
| ------ | ----------------------------------------------------- | ----------------------------------------------------------------- |
| GET    | `/api/neurodiversity-adjustment-requests`             | List requests (most recent first)                                 |
| POST   | `/api/neurodiversity-adjustment-requests`             | Create a request (FKs `workerId`, `managerId`)                    |
| GET    | `/api/neurodiversity-adjustment-requests/{id}`        | Return one request record                                         |
| PATCH  | `/api/neurodiversity-adjustment-requests/{id}`        | Replace the request fields                                        |
| DELETE | `/api/neurodiversity-adjustment-requests/{id}`        | Delete a request (cascades its grade, rules, flags)               |
| POST   | `/api/neurodiversity-adjustment-requests/{id}/submit` | Run the engine, transactionally persist the grade + rules + flags |
| GET    | `/api/neurodiversity-adjustment-requests/{id}/result` | Return the stored grade with its fired rules and flags            |
| GET    | `/api/dashboard`                                      | List requests joined with their grade (`?status=`, `?limit=`)     |

All bodies are `application/json` with camelCase keys via
`serde(rename_all = "camelCase")`.

## Database

Relational schema, one SeaORM entity and one Loco migration per SQL table,
faithfully reproducing the form's `sql/` source of truth:

- `workers` — the neurodivergent worker.
- `managers` — the manager / HR contact handling the request.
- `neurodiversity_adjustment_requests` — source-of-truth request (FKs to
  `workers` and `managers`).
- `neurodiversity_adjustment_request_grades` — computed four-axis grade, 1:1 with
  the request (enforced by the submit endpoint's delete-then-insert).
- `neurodiversity_adjustment_request_grade_rules` — one row per fired rule (the
  audit trail).
- `neurodiversity_adjustment_request_grade_flags` — one row per compliance flag.

The submit endpoint runs the pure engine over the request (joined with its
worker and manager) and persists the grade, rules, and flags inside a single
transaction. The Loco-default `users` table is included for auth parity with the
canonical template.

## Tests

`tests/engine/` ports the SvelteKit engine tests: `cargo test --test engine_tests`.
