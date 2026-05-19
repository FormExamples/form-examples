//! Application wiring.
//!
//! In the eventual Loco 0.16 build this module implements the `Hooks` trait
//! and registers routes, workers, tasks and initializers. For now it exposes
//! a minimal axum `Router` so the binary entrypoint compiles.

use axum::{routing::get, Router};

/// Build the application router.
pub fn router() -> Router {
    Router::new().route("/", get(index))
}

async fn index() -> &'static str {
    "Medical Information Form for Air Travel (MEDIF) — server skeleton."
}
