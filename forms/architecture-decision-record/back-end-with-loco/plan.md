# back-end-with-loco — Plan

Status: Loco app scaffolded 2026-05-11; ADR-specific models and templates
pending.

## What's done

- `loco new` generated the standard Loco starter (User, auth, mailer,
  workers, fixtures, tests).
- `cargo check` and `cargo build` pass.
- `templates/base.html.tera` carries the HTMX 2.0.8 + Alpine.js 3.14.8
  CDN scripts and `<body hx-boost="true">`, matching the form
  convention used elsewhere in this repo.

## What's next

1. Run `cargo loco generate scaffold` for each of the 5 ADR tables. The
   one-shot script at `../back-end-with-loco-setup`
   creates the Postgres databases first.
2. Replace the default starter `User` model and auth routes with the
   `author` model (or remove auth entirely — the ADR form is not
   user-facing in the same way).
3. Customize generated templates into a single-page 16-section wizard,
   matching the layout used in `../front-end-with-svelte/`.
4. HTMX-drive the dynamic lists:
   - `hx-post /positions` to add an alternative
   - `hx-delete /positions/:id` to remove
   - `hx-post /notes` to append a timestamped note
5. Render a Markdown ADR at `/architecture_decision_records/:id.md`
   using the same `build_markdown` shape as the SvelteKit form.

## Notes

- The default starter tests under `tests/requests/auth` require a
  Postgres instance. They are not relevant to the ADR domain and can be
  deleted once the auth scaffolding is removed.
- Field-name conversion: `serde(rename_all = "camelCase")` on any struct
  exposed to HTMX/Alpine, since the front-end templates assume camelCase.
