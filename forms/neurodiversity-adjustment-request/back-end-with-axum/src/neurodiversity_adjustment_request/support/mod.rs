//! Service-side helpers that `axa` deliberately leaves to each service: the
//! database pool, list paging, model errors, and seeding. Every form's back-end
//! carries an identical copy of this module.

pub mod model;
pub mod paging;
pub mod prelude;
pub mod seed;

use axa::{AppContext, Result};
use axum::{
    http::{HeaderValue, header},
    response::{IntoResponse, Response},
};
use sqlx::PgPool;

pub use seed::seed;

/// The database pool, which boot stores in the shared store.
///
/// # Panics
///
/// If boot did not install a pool, which is a programming error.
#[must_use]
pub fn db(ctx: &AppContext) -> PgPool {
    ctx.shared_store
        .get::<PgPool>()
        .expect("boot installs the database pool")
}

/// A YAML response.
///
/// # Errors
///
/// Never fails today; the signature matches the `axa::format` helpers.
pub fn yaml(body: &str) -> Result<Response> {
    Ok((
        [(
            header::CONTENT_TYPE,
            HeaderValue::from_static("application/yaml"),
        )],
        body.to_string(),
    )
        .into_response())
}
