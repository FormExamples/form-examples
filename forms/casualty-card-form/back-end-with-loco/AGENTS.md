# Casualty Card Form — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Casualty Card Form form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`casualty_card_form/`](./casualty_card_form/) — the Loco crate: `src/casualty_card_form/` holds `app.rs`
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

  - `casualty_card`
  - `casualty_card_allergy`
  - `casualty_card_arrival_triage`
  - `casualty_card_assessment_plan`
  - `casualty_card_clinical_examination`
  - `casualty_card_demographics`
  - `casualty_card_disposition`
  - `casualty_card_gp`
  - `casualty_card_investigations`
  - `casualty_card_medical_history`
  - `casualty_card_medication`
  - `casualty_card_next_of_kin`
  - `casualty_card_pain_assessment`
  - `casualty_card_presenting_complaint`
  - `casualty_card_primary_survey`
  - `casualty_card_safeguarding_consent`
  - `casualty_card_treatment`
  - `casualty_card_vital_signs`
  - `clinician`
  - `flagged_issue`
  - `news2_result`
  - `patient`

## Engine

`src/casualty_card_form/` also carries the form-specific scoring engine (types + a grader
/ calculator + rules + flagged-issues), exercised by `cargo test` and matching
the front-end engine and the form's `spec/`.

## Verify

```sh
cd casualty_card_form && cargo check --all-targets && cargo test
```
