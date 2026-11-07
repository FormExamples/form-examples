//! Service-side helpers that `axa` deliberately leaves to each service: the
//! database pool, list paging, model errors, and seeding. Every form's back-end
//! carries an identical copy of this module.

pub mod model;
pub mod prelude;
pub mod seed;

use axa::{
    cursor_pagination::{CursorKey, CursorLimits, CursorPage},
    AppContext, Environment, Error, Result,
};
use axum::{
    http::{header, HeaderValue, Uri},
    response::{IntoResponse, Response},
};
use sqlx::PgPool;
use std::num::NonZeroU32;

pub use seed::seed;

/// The page sizes of every list route. `limit` and its default match
/// `openapi.yaml`. A larger limit is refused, not clamped.
pub const PAGE_LIMITS: CursorLimits = CursorLimits {
    default_limit: 100,
    max_limit: 1000,
};

/// The key that signs list cursors in development and test when `CURSOR_KEY` is
/// not set. It is in the source, so anyone can sign a cursor with it, which is
/// why a production-like environment refuses to fall back to it.
const DEVELOPMENT_CURSOR_KEY: &[u8; 32] = b"development cursor key; public!!";

/// The key that signs list cursors: `CURSOR_KEY`, at least 32 bytes, the same on
/// every replica. Development and test fall back to a public key.
///
/// # Errors
///
/// Fails when `CURSOR_KEY` is shorter than 32 bytes, or is not set where the
/// environment is production-like.
pub fn cursor_key(environment: &Environment) -> Result<CursorKey> {
    match std::env::var("CURSOR_KEY") {
        Ok(secret) => CursorKey::new(secret.as_bytes()).map_err(Error::wrap),
        Err(_) if environment.is_production_like() => Err(Error::string(
            "CURSOR_KEY must be set, to at least 32 bytes, to sign list cursors",
        )),
        Err(_) => CursorKey::new(DEVELOPMENT_CURSOR_KEY).map_err(Error::wrap),
    }
}

/// The page a list request asks for, read from its URI and checked against the
/// cursor key `App::context` stored.
///
/// # Errors
///
/// A bad `limit` or `cursor` is a `422`. A context with no cursor key is a `500`.
pub fn cursor_page(ctx: &AppContext, uri: &Uri) -> Result<CursorPage> {
    let key = ctx
        .shared_store
        .get_ref::<CursorKey>()
        .ok_or_else(|| Error::string("App::context stores no cursor key"))?;
    Ok(CursorPage::new(&key, PAGE_LIMITS, uri)?)
}

/// Requests one client may make in each window: plenty for a person using a
/// form, and a stop on a runaway script.
pub const RATE_LIMIT_REQUESTS: NonZeroU32 = NonZeroU32::new(600).unwrap();

/// The rate limit's window, in seconds.
pub const RATE_LIMIT_WINDOW_SECONDS: NonZeroU32 = NonZeroU32::new(60).unwrap();

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
