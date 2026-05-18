# Tasks — ICVP Loco backend

- [x] `Cargo.toml` workspace + package manifest
- [x] `.gitignore`
- [x] `src/bin/main.rs`, `src/bin/cli.rs`
- [x] `src/app.rs` with Loco `App` impl
- [x] `src/controllers/certificate.rs` (`show_certificate`, `submit_certificate`, `show_report`)
- [x] `src/models/validation.rs` (port of the TS engine, rules VAL001..VAL012)
- [x] `src/models/mod.rs`, `src/controllers/mod.rs`
- [x] `templates/base.html.tera` with the HTMX + Alpine CDN tags and `<body hx-boost="true">`
- [x] `templates/certificate.html.tera` + eight `certificate/stepNN.html.tera`
- [x] `templates/report.html.tera`
- [x] `config/development.yaml`, `config/test.yaml`, `config/production.yaml`
- [x] `migration/` sub-crate with one migration per table
- [x] `target/.gitkeep`
- [x] `../full-stack-with-loco-tera-htmx-alpine-setup` shell script
