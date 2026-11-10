//! `/_health/ready` against a database that has gone away.

#![forbid(unsafe_code)]

use axa_test::prelude::*;
use cardiology_request_axum_crate::{app::App, support::db};

/// `/_health/ready` asks `ctx.db`, so it must fail with the database gone.
#[tokio::test]
async fn readiness_fails_when_the_database_stops_answering() {
    request::<App, _, _>(|request, ctx| async move {
        db(&ctx).close().await;

        let response = request.get("/_health/ready").await;

        response.assert_status(axum::http::StatusCode::SERVICE_UNAVAILABLE);
        assert!(response.text().contains("database"));
    })
    .await;
}
