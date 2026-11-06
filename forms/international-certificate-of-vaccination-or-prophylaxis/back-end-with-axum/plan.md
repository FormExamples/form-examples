# Plan — ICVP Loco backend

## Status: in progress

## Milestones

- [x] Author `Cargo.toml` workspace + package manifest
- [x] Author `.gitignore`
- [x] `src/bin/main.rs` and `src/bin/cli.rs`
- [x] `src/app.rs` with Loco `App` trait impl
- [x] `templates/base.html.tera` with the HTMX + Alpine CDN tags
- [x] `templates/certificate.html.tera` + eight `certificate/stepNN.html.tera` partials
- [x] `config/{development,test,production}.yaml`
- [x] `migration/` sub-crate with one migration per SQL table
- [x] Validation engine port in `src/models/validation.rs`
- [x] Controllers: `show_certificate`, `submit_certificate`, `show_report`
- [x] `target/` directory present (empty `.gitkeep`)
- [ ] End-to-end Cargo build verified locally

## Out of scope

- Authentication / authorization (Loco's auth scaffolding can be enabled
  later).
- Background jobs for asynchronous PDF rendering.
- Container/Kubernetes manifests.
