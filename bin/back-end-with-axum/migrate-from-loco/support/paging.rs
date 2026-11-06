//! One page of a list, as each form's `openapi.yaml` describes it.

use axa::{
    pagination::{Limits, Page, PageParams},
    Error, Result,
};
use axum::{
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;

/// The bounds of every list route. `limit` and its default match `openapi.yaml`.
pub const LIMITS: Limits = Limits {
    default_limit: 100,
    max_limit: 1000,
    max_offset: 100_000,
};

/// The page a request asked for.
///
/// # Errors
///
/// Answers `400` when the offset is past [`LIMITS`].
pub fn resolve(params: &PageParams) -> Result<Page> {
    params
        .resolve(LIMITS)
        .map_err(|error| Error::BadRequest(error.to_string()))
}

/// `LIMIT` and `OFFSET` as Postgres takes them.
#[must_use]
pub fn bounds(page: Page) -> (i64, i64) {
    (
        i64::try_from(page.limit).unwrap_or(i64::MAX),
        i64::try_from(page.offset).unwrap_or(i64::MAX),
    )
}

/// The rows as a bare JSON array, with the total in the response headers.
///
/// # Errors
///
/// Never fails today; the signature matches the `axa::format` helpers.
pub fn respond<T: Serialize>(page: Page, total: i64, rows: Vec<T>) -> Result<Response> {
    let total = u64::try_from(total).unwrap_or(0);
    Ok((page.headers(total), Json(rows)).into_response())
}
