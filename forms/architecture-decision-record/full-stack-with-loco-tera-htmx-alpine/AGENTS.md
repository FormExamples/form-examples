# full-stack-with-loco-tera-htmx-alpine — Agent Instructions

Pending implementation. When building this:

- Match the stack used in
  `../../pre-operative-assessment-by-clinician/full-stack-with-loco-tera-htmx-alpine/`:
  Rust edition 2024, Loco 0.16, axum 0.8, SeaORM 1.1, Tera, HTMX 2.0.8,
  Alpine.js 3.14.8.
- Generate models via `cargo loco generate scaffold <table> <fields...>`
  one per table in `sql-migrations/`.
- The wizard is server-rendered Tera with `hx-boost="true"` on the body
  and `hx-swap` on the dynamic position list.
- Use `serde(rename_all = "camelCase")` on any struct shared with the
  front-end (HTMX or Alpine.js).
- Keep template names matching the plural table names: `authors.html.tera`,
  `architecture_decision_records.html.tera`, etc.
