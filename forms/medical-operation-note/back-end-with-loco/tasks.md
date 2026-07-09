# Tasks - Rust full-stack backend

## Done

- [x] Run `00-new.sh` to provision databases and the Loco app
- [x] Rename app dir to snake_case (`medical_operation_note/`)
- [x] Fix dev/test config DB URIs to use snake_case names
- [x] Run the setup script (with `:ts`->`:tstz` patch) - scaffold all 13 tables
- [x] Hand-fix the `lead_surgeon_id` FK to point at `clinicians`
- [x] Apply migrations to development and test DBs
- [x] Regenerate SeaORM entities
- [x] Author scoring engine: 7 rule files + composite grader + types module
- [x] 25 inline `#[cfg(test)]` unit tests + 5 integration tests
- [x] Wire `engine` module into `src/lib.rs`
- [x] Author `src/controllers/operation_note.rs` and routes
- [x] Register route in `src/app.rs` and `src/controllers/mod.rs`
- [x] Author 12 step partials in `assets/views/operation_note/steps/`
- [x] Author wizard `index.html` and `report.html`
- [x] Update `assets/views/base.html` to HTMX 2.0.8 + Alpine + hx-boost
- [x] Author `templates/base.html.tera` for the test-form contract
- [x] Symlink `Cargo.toml`, `src`, `tests`, `assets`, `config`,
      `migration`, `target`, `.gitignore` at the outer directory
- [x] Make i18n init degrade gracefully so test boot succeeds even
      with the loco-starter FTL issues
- [x] `cargo build`, `cargo check`, `cargo test` all clean
- [x] Author the four root docs (`index.md`, `AGENTS.md`, `plan.md`,
      `tasks.md`)

## Future

- [ ] Persist `WizardForm` payload to `medical_operation_notes` and
      child tables on submit, instead of in-memory only
- [ ] Replace the `download_pdf` text/plain stub with a real
      `printpdf`/`weasyprint` signed-PDF generator
- [ ] Emit FHIR R5 `Procedure` bundle from the persisted row (mirror
      the schemas in `forms/medical-operation-note/fhir/r5/`)
- [ ] Move the live grade preview from Alpine.js to a real HTMX
      partial endpoint (`hx-post=/operation-note/preview`) that
      reuses the Rust grader so the front-end and back-end agree
- [ ] Add `cargo loco db seed` fixtures for a sample patient,
      clinician, and operation note to ease manual QA
