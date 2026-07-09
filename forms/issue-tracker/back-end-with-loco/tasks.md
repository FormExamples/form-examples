# Tasks

- [x] Implement the Rust scoring engine in `src/scoring/` mirroring the
      TypeScript engine in
      `../front-end-with-svelte/src/lib/engine/`
- [x] Author `tests/scoring_tests.rs` covering every rule and the
      composite grader (17 tests, all passing)
- [x] Author the CLI binary `src/bin/main.rs`
      (`issue-tracker-cli`) that takes a JSON `IssueTrackerAssessment`
      on stdin and emits a JSON `GradeResult` on stdout

- [x] Author Tera templates:
      - `templates/assessment.html.tera` — top-level wizard, extends
        `base.html.tera`, includes ten step partials
      - `templates/assessment/step01.html.tera` … `step10.html.tera` —
        plain-markup `<fieldset>` per SOAP / scoring section
      - `templates/report.html.tera` — renders a `GradeResult` with the
        composite-priority badge, the seven scores, fired rules, and
        safety flags
      - `templates/dashboard.html.tera` — HTMX-driven filter chrome
        (`hx-get`, `hx-target`, debounced search) over the issues table
- [x] Author `tests/template_tests.rs` (5 tests, all passing) confirming
      every `.tera` file parses, the wizard injects HTMX 2.0.8 + Alpine.js
      3.14.8 + `hx-boost` from `base.html.tera`, the report renders rules
      and flags, and the dashboard renders both result and no-results
      branches

## Pending

- [ ] Run `../back-end-with-loco-setup` to produce
      SeaORM entities and Loco controllers from the SQL migrations
      (re-adds Loco / SeaORM / axum deps to `Cargo.toml` and restores
      the `migration/` sub-crate)
- [ ] Wire HTMX `hx-boost` navigation in the Loco controllers
- [ ] Wire Alpine.js conditional-field directives onto specific
      step partials (e.g. show `data_corruption` extra fields only when
      `data_corruption` is `suspected` or `confirmed`)
