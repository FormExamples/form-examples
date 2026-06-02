# Plan — Full-Stack Loco / Tera / HTMX / Alpine — UK NHS FP92A

## Status

- [x] Crate scaffold (`Cargo.toml`, `src/main.rs`)
- [x] In-memory store keyed by application UUID
- [x] Tera template glob (`templates/**/*.tera`)
- [x] Engine — `ApplicationData`, `QualifyingCondition`, `GradeResult`
- [x] Engine — 10 eligible-condition rules
- [x] Engine — disqualifying rules (diet-only diabetes, temporary disability)
- [x] Engine — redirect rules (pregnancy to FW8, age-based exemption)
- [x] Engine — completeness rules (NHS number, surname, forenames, DOB, address, practitioner, signature, records access)
- [x] Engine — renewal rule (active certificate already on file)
- [x] Engine — additional flags
- [x] Engine unit tests
- [x] Controller routes (landing, new, show, submit, report)
- [x] Template: `base.html.tera` (HTMX + Alpine CDN, `hx-boost="true"`)
- [x] Template: `landing.html.tera`
- [x] Template: `application/index.html.tera` (10 steps)
- [x] Template: `application/report.html.tera` (outcome, fired rules, flags, printable)

## Next steps

1. Replace the in-memory store with Postgres-backed persistence.
2. Re-scaffold via `cargo loco generate` using
   `../back-end-with-loco-setup`.
3. Replace the printable HTML report with a true PDF preview matching the
   FP92A paper layout.
4. Generate a FHIR R5 Bundle (Patient + Practitioner + Coverage + Condition)
   on submit.
5. Add CSV / TSV / XML / JSON export endpoints.
6. Add a dashboard route for browsing in-flight applications.

## Architecture

```
HTTP request
   |
   v
axum Router (controllers::application::router)
   |
   +-- GET /                           -> render landing.html.tera
   +-- POST /application/new           -> insert ApplicationData -> redirect
   +-- GET /application/{id}           -> render application/index.html.tera
   +-- POST /application/{id}/submit   -> parse form -> store -> redirect
   +-- GET /application/{id}/report    -> validate_fp92a(&data) -> render report
   |
   v
engine::fp92a_validator (pure function)
   |
   v
GradeResult { outcome, redirectTo, eligibleConditionCodes, firedRules,
              additionalFlags, validFrom, validUntil, validityYears }
```
