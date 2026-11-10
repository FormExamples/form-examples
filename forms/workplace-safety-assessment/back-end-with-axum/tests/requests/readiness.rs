use axa_test::prelude::*;
use serial_test::serial;
use workplace_safety_assessment::app::App;

/// `/_health/ready` asks `ctx.db`, so it must fail with the database gone.
#[tokio::test]
#[serial]
async fn readiness_fails_when_the_database_stops_answering() {
    request::<App, _, _>(|request, ctx| async move {
        crate::db(&ctx).close().await;

        let response = request.get("/_health/ready").await;

        response.assert_status(axum::http::StatusCode::SERVICE_UNAVAILABLE);
        assert!(response.text().contains("database"));
    })
    .await;
}
