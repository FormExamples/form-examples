#![forbid(unsafe_code)]
use cardiology_response_axum_crate::app::App;
use axa::testing::prelude::*;
use serde_json::Value;

/// A fresh database has no rows, so a page is empty and links nowhere; the limits
/// `openapi.yaml` publishes are refused, never clamped, outside their range.
#[tokio::test]
async fn lists_come_in_cursor_pages() {
    request::<App, _, _>(|request, _ctx| async move {
        let page = request.get("/api/cardiology_responses?limit=1").await;
        page.assert_status_ok();
        assert!(page.maybe_header("x-total-count").is_none());
        assert!(page.maybe_header("link").is_none());
        let rows: Vec<Value> = page.json();
        assert!(rows.is_empty());

        for refused in [
            "/api/cardiology_responses?cursor=forged",
            "/api/cardiology_responses?limit=0",
            "/api/cardiology_responses?limit=1001",
            "/api/cardiology_responses?limit=many",
        ] {
            request.get(refused).await.assert_status_unprocessable_entity();
        }
    })
    .await;
}
