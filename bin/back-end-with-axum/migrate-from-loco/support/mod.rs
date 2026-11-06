//! Service-side helpers that `axa` deliberately leaves to each service: the
//! database pool, list paging, model errors, and seeding. Every form's back-end
//! carries an identical copy of this module.

pub mod model;
pub mod paging;
pub mod prelude;
pub mod problem;
pub mod seed;

use axa::{AppContext, Result};
use axum::{
    http::{header, HeaderValue},
    response::{IntoResponse, Response},
};
use sqlx::PgPool;

pub use seed::seed;

/// The database pool.
#[must_use]
pub fn db(ctx: &AppContext) -> PgPool {
    ctx.db.clone()
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
