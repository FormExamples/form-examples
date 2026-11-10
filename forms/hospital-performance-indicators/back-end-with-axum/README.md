# Hospital performance indicators: Back-end with Rust Axum (JSON API)

Server-side Rust JSON API for this form, built with Axum, axa, sqlx, and
PostgreSQL. See [`AGENTS.md`](AGENTS.md) for the layout and
[`../../../AGENTS/back-end-with-axum.md`](../../../AGENTS/back-end-with-axum.md)
for the stack and conventions.

```sh
cargo run -- db migrate
cargo run -- start
cargo test
```
