# ICVP — Full Stack with Rust axum Loco Tera HTMX Alpine

Server-rendered Rust web app for the WHO **International Certificate of
Vaccination or Prophylaxis**. Loco 0.16 on axum 0.8, SeaORM 1.1 with
PostgreSQL 18, Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8.

## Crate layout

```
full-stack-with-loco-tera-htmx-alpine/
  Cargo.toml                  # Workspace + package manifest
  .gitignore
  src/
    bin/
      main.rs                 # HTTP entrypoint
      cli.rs                  # Loco CLI entrypoint
    app.rs                    # Loco App trait impl
    controllers/              # axum handlers per resource
    models/
      validation.rs           # validateCertificate engine (Rust port)
    tasks/                    # Loco background tasks (optional)
    views/                    # Tera render helpers
    workers/                  # Loco workers (optional)
  templates/
    base.html.tera            # Base layout — HTMX + Alpine CDN tags
    certificate.html.tera     # Single-page wizard layout
    certificate/
      step01.html.tera        # 8 step partials
      step02.html.tera
      step03.html.tera
      step04.html.tera
      step05.html.tera
      step06.html.tera
      step07.html.tera
      step08.html.tera
    report.html.tera          # Validity report page
  config/
    development.yaml          # international_certificate_of_vaccination_or_prophylaxis_development
    test.yaml                 # international_certificate_of_vaccination_or_prophylaxis_test
    production.yaml           # uses DATABASE_URL
  migration/                  # SeaORM migration crate
    src/
      lib.rs
      m_20260101_000001_create_patient.rs
      m_20260101_000002_create_clinician.rs
      m_20260101_000003_create_center.rs
      m_20260101_000004_create_certificate.rs
      m_20260101_000005_create_certificate_entry.rs
  target/                     # Cargo build directory
```

See the parent
[AGENTS/full-stack-with-loco-tera-htmx-alpine.md](../../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md)
for the canonical full-stack stack and the asserts the test harness applies
to `templates/base.html.tera`.

## Routes

| Method | Route | Handler | Purpose |
| --- | --- | --- | --- |
| GET  | `/certificate/{id}` | `show_certificate` | Render the single-page wizard |
| POST | `/certificate/{id}/submit` | `submit_certificate` | Persist + re-validate |
| GET  | `/certificate/{id}/report` | `show_report` | Render the validity report |

## Database

Development: `international_certificate_of_vaccination_or_prophylaxis_development`
Test:        `international_certificate_of_vaccination_or_prophylaxis_test`
Production:  driven by `DATABASE_URL`

The full form name is never abbreviated.
