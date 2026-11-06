//! `/_readiness` against a database that has gone away.

#![forbid(unsafe_code)]

use axa::testing::prelude::*;
use neurodiversity_adjustment_request_axum_crate::{app::App, support::db};

/// Without the check added in `App::context`, `/_readiness` would keep
/// answering 200 with the database gone.
#[tokio::test]
async fn readiness_fails_when_the_database_stops_answering() {
    request::<App, _, _>(|request, ctx| async move {
        db(&ctx).close().await;

        let response = request.get("/_readiness").await;

        response.assert_status(axum::http::StatusCode::SERVICE_UNAVAILABLE);
        assert!(response.text().contains("database"));
    })
    .await;
}
