# US HIPAA Authorization — full-stack (Loco + axum + Tera + HTMX + Alpine)

Rust full-stack implementation of the HIPAA authorization form. Uses
the Loco framework on top of axum for routing, SeaORM for persistence,
Tera for server-rendered templates, and HTMX + Alpine.js for
client-side interactivity. Field shape mirrors the SvelteKit
front-end via `serde(rename_all = "camelCase")`.

## Stack

- Rust edition 2024
- Loco 0.16
- axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera 1.20 templates
- HTMX 2.0.8 (loaded via CDN by `templates/base.html.tera`)
- Alpine.js 3.14.8 (loaded via CDN by `templates/base.html.tera`)

## Routes

- `GET /` — landing page.
- `GET /authorizations` — list view (HTML or JSON via `Accept` header).
- `GET /authorizations/new` — new authorization wizard.
- `GET /authorizations/:id` — authorization detail.
- `PATCH /authorizations/:id` — update via HTMX swap.
- `POST /authorizations/:id/sign` — sign and validate.
- `POST /authorizations/:id/revoke` — revoke.
- `GET /authorizations/:id/report.pdf` — PDF report.
- `GET /dashboard` — server-rendered dashboard view.

## Develop

```sh
cd ../  # at form root
./full-stack-with-loco-tera-htmx-alpine-setup
cd full-stack-with-loco-tera-htmx-alpine
cargo loco start
```

## Verify

```sh
cargo build
cargo test
```
