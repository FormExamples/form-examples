# Plan

Build the Rust full-stack agile-consulting scorecard on top of the
already-tested scoring engine.

1. Run `../full-stack-with-loco-tera-htmx-alpine-setup` to generate
   SeaORM entities and Loco controllers from the SQL migrations.
2. Wire the scoring engine into a `POST /scorecard/{id}/grade` axum
   route that recomputes `score_total`, `manifesto_subtotal`,
   `principles_subtotal`, the band, fired rules, and readiness flags.
3. Author Tera templates: `assessment.html.tera` (six-step wizard with
   step partials), `report.html.tera`, `dashboard.html.tera`.
4. Add HTMX-driven dashboard with filter / sort / search.
5. Cover controllers and routes with `cargo test`.
