# United Kingdom Lasting Power of Attorney for Health and Care Decisions — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the United Kingdom Lasting Power of Attorney for Health and Care Decisions form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/`](./united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/) — the Loco crate: `src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/` holds `app.rs`
  (route registration), `controllers/`, `models/`, `bin/main.rs`; alongside
  `migration/`, `config/` (dev / test / production YAML), and `tests/`.
- **Relational per-table schema** mirroring [`../sql/`](../sql/): one SeaORM
  model and one RESTful scaffold controller per SQL table — patients,
  clinicians, the form's own tables, and (where the form is scored) the
  grade / grade_rule / grade_flag tables. There is no single JSONB blob table.

## JSON API

A RESTful JSON resource is served per domain table under `/api/…`, each
supporting list (`GET`), create (`POST`), and `GET` / `PUT` / `PATCH` /
`DELETE` by id. All bodies are `application/json` with camelCase keys via
`serde(rename_all = "camelCase")`. Prometheus metrics are exposed at
`/metrics`. The registered domain controllers are:

  - `attorney`
  - `certificate_provider`
  - `donor`
  - `lpa`
  - `lpa_attorney`
  - `lpa_decision_rule`
  - `lpa_instruction`
  - `lpa_lst_choice`
  - `lpa_person_to_notify`
  - `lpa_preference`
  - `lpa_registration_application`
  - `lpa_replacement_attorney`
  - `lpa_signature`
  - `lpa_validity`
  - `lpa_validity_additional_flag`
  - `lpa_validity_fired_rule`
  - `person_to_notify`
  - `replacement_attorney`

## Engine

`src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/` also carries the form-specific scoring engine (types + a grader
/ calculator + rules + flagged-issues), exercised by `cargo test` and matching
the front-end engine and the form's `spec/`.

## Verify

```sh
cd united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions && cargo check --all-targets && cargo test
```
