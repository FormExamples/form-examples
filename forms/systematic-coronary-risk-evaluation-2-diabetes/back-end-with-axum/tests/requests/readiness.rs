use axa::testing::prelude::*;
use serial_test::serial;
use systematic_coronary_risk_evaluation_2_diabetes::app::App;

/// `/_readiness` asks `ctx.db`, so it must fail with the database gone.
#[tokio::test]
#[serial]
async fn readiness_fails_when_the_database_stops_answering() {
    request::<App, _, _>(|request, ctx| async move {
        crate::db(&ctx).close().await;

        let response = request.get("/_readiness").await;

        response.assert_status(axum::http::StatusCode::SERVICE_UNAVAILABLE);
        assert!(response.text().contains("database"));
    })
    .await;
}
