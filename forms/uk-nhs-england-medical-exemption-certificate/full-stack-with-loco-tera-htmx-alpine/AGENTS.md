# Full-Stack with Loco / Tera / HTMX / Alpine — UK NHS FP92A

Rust full-stack implementation of the **FP92A Medical Exemption Certificate**
application. Despite the directory name, the crate is currently a minimal
**axum + Tera + HTMX + Alpine.js** server (no Loco / SeaORM / Postgres
dependency) — mirroring the canonical reference at
`forms/united-kingdom-maternity-certificate-mat-b1/full-stack-with-loco-tera-htmx-alpine/`.

A future iteration will be re-scaffolded with full Loco / SeaORM via the
sibling [`../full-stack-with-loco-tera-htmx-alpine-setup`](../full-stack-with-loco-tera-htmx-alpine-setup)
shell script.

## Crate layout

```
full-stack-with-loco-tera-htmx-alpine/
  Cargo.toml                                 # axum, tera, tokio, tracing, uuid, chrono, serde
  src/
    main.rs                                  # axum entry point, Tera template glob
    controllers/
      mod.rs
      application.rs                         # GET /, POST /application/new, GET /application/{id}, POST submit, GET report
    engine/
      mod.rs
      types.rs                               # ApplicationData mirroring SQL
      fp92a_rules.rs                         # Closed list of 10 eligible conditions + disqualifying + redirect + completeness rules
      fp92a_validator.rs                     # Pure function returning GradeResult
      flagged_issues.rs                      # Advisory flags (pregnancy, age, signature, NHS number, histology)
    views/
      mod.rs
      application.rs                         # Tera context builders
  templates/
    base.html.tera                           # HTMX 2.0.8 + Alpine 3.14.8 layout
    landing.html.tera                        # Intro page → POST /application/new
    application/
      index.html.tera                        # 10-step single-page wizard (Alpine.js step state, HTMX boost)
      report.html.tera                       # Eligibility outcome, fired rules, flags, PDF-ready printable
  target/                                    # cargo build output (empty; populated on first build)
```

## Data model

Mirrors the SQL migrations in `../sql-migrations/`:

- `patient` — applicant demographics
- `practitioner` — signing clinician
- `eligible_condition` — closed lookup (10 NHSBSA codes)
- `application` — one FP92A submission
- `application_eligible_condition` — join with condition-specific detail
- `grade` — eligibility outcome
- `grade_fired_rule` — audit trail of fired rules
- `grade_additional_flag` — advisory flags

Application state is currently held in a process-wide
`Arc<Mutex<HashMap<Uuid, ApplicationData>>>` — no database for now.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Landing page |
| POST | `/application/new` | Create a new application; 302 to wizard |
| GET | `/application/{id}` | Render the 10-step wizard |
| POST | `/application/{id}/submit` | Persist data; 302 to report |
| GET | `/application/{id}/report` | Render the eligibility report |

## Engine

`fp92a_validator::validate_fp92a(&ApplicationData) -> GradeResult` is a pure
function with no I/O. It returns:

- `outcome` — `eligible` / `ineligible` / `requires-clarification`
- `redirectTo` — `""` / `FW8` / `age-exemption` / `low-income-scheme` / `hc1` / `hc2`
- `eligibleConditionCodes` — codes that matched
- `firedRules` — every rule that fired, sorted by priority
- `additionalFlags` — advisory flags (NHS number, signature, pregnancy, age, histology, active certificate)
- `validFrom` / `validUntil` — 5-year validity window

## Conventions

- `serde(rename_all = "camelCase")` on all front-end-facing structs.
- Empty string `""` for unanswered text / enum fields.
- `Option<...>` for unanswered numeric fields.
- 10-step single-page wizard — no multi-page forms.
- HTMX 2.0.8 + Alpine.js 3.14.8 via CDN (versions pinned in `base.html.tera`).

## Run

```sh
cargo run
# Listening on http://127.0.0.1:3000
```

## Verify

```sh
bin/test-form uk-nhs-england-medical-exemption-certificate
```
