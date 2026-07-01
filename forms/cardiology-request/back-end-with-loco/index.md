# Cardiology Request — Rust axum + Loco JSON API

Pure JSON API back-end for the Cardiology Request form (a cardiology referral /
consult request), built with axum + Loco + SeaORM + PostgreSQL. No HTML, no Tera,
no HTMX, no Alpine.js, no CSS.

## Engine

`src/engine/` is a one-to-one Rust port of
`../front-end-with-svelte/src/lib/engine/`. The four axes:

- **A appropriateness** — `usually-appropriate` / `may-be-appropriate` / `usually-not-appropriate`
- **B safety** — `ok` / `caution` / `red-flag`
- **C completeness** — weighted 0–100
- **D triage** — `routine` / `urgent` / `emergency` + target timeframe

Plus an overall recommendation (`accept` / `query-referrer` / `redirect` /
`reject`), the fired-rule audit trail, and safety flags. Rule IDs (`R-*`), flag
IDs (`F-*`), axis names, bands, thresholds, and firing order are identical to the
front-end engine. The red-flag auto-escalation invariant is preserved.

## JSON API

| Method | Route                                  | Purpose                                                           |
| ------ | -------------------------------------- | ----------------------------------------------------------------- |
| GET    | `/api/cardiology_requests`             | List requests (most recent first)                                 |
| POST   | `/api/cardiology_requests`             | Create a referral request (FKs `patientId`, `clinicianId`)        |
| GET    | `/api/cardiology_requests/{id}`        | Return one request record                                         |
| PATCH  | `/api/cardiology_requests/{id}`        | Replace the request fields                                        |
| DELETE | `/api/cardiology_requests/{id}`        | Delete a request (cascades its grade, rules, flags)               |
| POST   | `/api/cardiology_requests/{id}/submit` | Run the engine, transactionally persist the grade + rules + flags |
| GET    | `/api/cardiology_requests/{id}/result` | Return the stored grade with its fired rules and flags            |
| GET    | `/api/dashboard`                       | List requests joined with their grade (`?status=`, `?limit=`)     |

All bodies are `application/json` with camelCase keys via
`serde(rename_all = "camelCase")`.

## Database

Relational schema, one SeaORM entity and one Loco migration per SQL table,
faithfully reproducing the form's `sql/` source of truth:

- `patients` — patient demographics.
- `clinicians` — referring clinician.
- `cardiology_requests` — source-of-truth referral (FKs to `patients` and
  `clinicians`).
- `cardiology_request_grades` — computed four-axis grade, 1:1 with the request
  (enforced by the submit endpoint's delete-then-insert).
- `cardiology_request_grade_rules` — one row per fired rule (the audit trail).
- `cardiology_request_grade_flags` — one row per safety flag.

The submit endpoint runs the pure engine over the request (joined with its
patient and clinician) and persists the grade, rules, and flags inside a single
transaction. The Loco-default `users` table is included for auth parity with the
canonical template.

## Tests

`tests/engine/` ports `grader.test.ts` (12 cases): `cargo test --test engine_tests`.
