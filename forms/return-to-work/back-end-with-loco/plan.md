# Plan: Rust full-stack

## Build order

1. [ ] Run `../back-end-with-loco-new/00-new.sh`
       to scaffold a Loco project.
2. [ ] Port the Liquibase migrations from `../sql/` into
       SeaORM migrations under `migration/src/`.
3. [ ] Generate SeaORM entities (`cargo loco generate scaffold`).
4. [ ] Port the composite grader from
       `../front-end-form-with-svelte/src/lib/engine/` to
       `src/services/grader/`.
5. [ ] Build the Tera templates that mirror the 12-step wizard.
6. [ ] Wire HTMX step-navigation endpoints.
7. [ ] Build the JSON API controllers.
8. [ ] Add the FHIR R5 Bundle export endpoint.
9. [ ] Write unit tests for the composite grader.
10. [ ] Write integration tests for the REST endpoints.

## Future enhancements

- Background-job worker for batch PDF generation.
- SSO via NHS Care Identity Service 2 (CIS2).
- Audit log for every clinician override.
