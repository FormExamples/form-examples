//! RFC 9457 errors. Every failed request answers `application/problem+json`,
//! whichever layer failed it.
//!
//! `axa::Error` still answers `{"error": ..., "description": ...}`, and Axum's
//! extractors answer plain text. Rather than convert each one, [`respond`]
//! rewrites a failed response on its way out, so nothing can be missed. It runs
//! twice, because no single place sees everything:
//!
//! - Inside the standard middleware, ahead of compression, where it can still
//!   read the body that `axa::Error` wrote.
//! - Outside it, for the panics and timeouts the middleware itself answers.
//!
//! `axa::Error` keeps logging the real failure, and `/_` health routes keep their
//! own bodies.

use axa::{
    AppContext, Result, middleware,
    problem::{PROBLEM_JSON, Problem},
    routes::AppRoutes,
};
use axum::{
    Router,
    body::to_bytes,
    http::{HeaderMap, Uri, header},
    middleware::map_response,
    response::{IntoResponse, Response},
};
use serde::Deserialize;

/// Far more than any error body this service writes.
const MAX_ERROR_BODY: usize = 64 * 1024;

/// What `axa::Error` wrote that a client may read. Its `error` reason is left
/// out, because the status says the same.
#[derive(Debug, Default, Deserialize)]
struct Written {
    /// The text for the client.
    description: Option<String>,
    /// Per-field detail.
    errors: Option<serde_json::Value>,
}

/// The routes under the standard middleware, with every failure a problem.
///
/// # Errors
///
/// Fails when a configured CORS origin is invalid.
pub fn apply(table: AppRoutes, ctx: &AppContext) -> Result<Router> {
    let router = table.into_router(ctx.clone()).layer(map_response(respond));
    let router = middleware::apply(router, &ctx.config.http)?;
    Ok(router.layer(map_response(respond)))
}

/// Whether a response's content type starts with `kind`.
fn has_type(headers: &HeaderMap, kind: &str) -> bool {
    headers
        .get(header::CONTENT_TYPE)
        .and_then(|value| value.to_str().ok())
        .is_some_and(|value| value.starts_with(kind))
}

/// Rewrite a failed response as a problem, keeping its status and headers.
///
/// Only JSON is read for text. Plain text comes from Axum's extractors, which
/// quote what the client sent, so the title alone answers those. A server fault
/// gets no detail either, since its body says nothing more than the title.
pub async fn respond(uri: Uri, response: Response) -> Response {
    let status = response.status();
    if !(status.is_client_error() || status.is_server_error())
        || uri.path().starts_with("/_")
        || has_type(response.headers(), PROBLEM_JSON)
    {
        return response;
    }
    let (mut parts, body) = response.into_parts();
    let written = if status.is_client_error() && has_type(&parts.headers, "application/json") {
        let bytes = to_bytes(body, MAX_ERROR_BODY).await.unwrap_or_default();
        serde_json::from_slice(&bytes).unwrap_or_default()
    } else {
        Written::default()
    };
    let mut problem = Problem::new(status);
    if let Some(description) = written.description {
        problem = problem.with_detail(description);
    }
    if let Some(errors) = written.errors {
        problem = problem.with_extension("errors", errors);
    }
    let (fresh, body) = problem.into_response().into_parts();
    parts.headers.remove(header::CONTENT_ENCODING);
    parts.headers.remove(header::CONTENT_LENGTH);
    parts.headers.extend(fresh.headers);
    Response::from_parts(parts, body)
}
