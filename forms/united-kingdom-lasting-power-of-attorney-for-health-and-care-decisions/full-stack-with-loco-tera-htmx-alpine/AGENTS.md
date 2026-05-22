# UK LPA for Health and Care Decisions — Full stack — Agent Instructions

axum 0.8 + Loco 0.16 + SeaORM 1.1 + PostgreSQL + Tera + HTMX 2.0.8 +
Alpine.js 3.14.8. Server-rendered LP1H wizard.

## Conventions

- Rust edition 2024.
- `serde(rename_all = "camelCase")` on every struct shared with the
  front-end (HTMX fragments embed camelCase attribute names).
- `snake_case` table and column names matching the SQL migrations.
- UUIDv4 primary keys; `created_at`, `updated_at`, `deleted_at`.
- The validity engine lives in `src/services/lpa_validator.rs` as a pure
  function `calculate_lpa_validity(application) -> LpaValidityResult`.
  Rule identifiers match the SvelteKit and static HTML engines
  (`R-MCA-S9-AGE`, …) so audit logs are portable across implementations.

## Tera templates

- `templates/base.html.tera` — global layout, embeds HTMX and Alpine.js
  from CDN, sets `<body hx-boost="true">`.
- `templates/lpa/wizard.html.tera` — wizard shell.
- `templates/lpa/steps/step_01.html.tera` … `step_14.html.tera` — one
  fragment per step.
- `templates/lpa/_validity.html.tera` — validity summary fragment.
- `templates/lpa/_fired_rules.html.tera` — fired-rules list partial.
- `templates/dashboard.html.tera` — case-manager dashboard.

## HTMX patterns

- Each wizard step submits via `hx-post` to
  `POST /lpa/:id/step/:step` and the server re-renders the next step
  plus the validity-summary fragment.
- The validity summary swaps in on every save via `hx-swap-oob`.
- Alpine.js handles intra-step client state (e.g. add / remove attorney
  rows, joint-decision-set list editing).

## Routes

- `GET /lpa/new` — create a draft, redirect to step 1.
- `GET /lpa/:id/step/:step` — render a step.
- `POST /lpa/:id/step/:step` — persist a step, re-render next step.
- `POST /lpa/:id/validate` — recompute validity.
- `GET /lpa/:id/pdf` — OPG-ready PDF (via `genpdf` or `printpdf`).
- `GET /lpa/:id/fhir-bundle` — FHIR R5 Bundle JSON.
- `GET /lpa/:id/xml` — archival XML.
- `GET /dashboard` — case-manager dashboard.

## Stack reference

See parent
[AGENTS/full-stack-with-loco-tera-htmx-alpine.md](../../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md).
