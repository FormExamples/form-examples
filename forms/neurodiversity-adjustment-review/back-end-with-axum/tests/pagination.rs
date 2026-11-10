#![forbid(unsafe_code)]
//! Lists come in signed cursor pages, with no total.

use neurodiversity_adjustment_review_axum_crate::app::App;
use axa_test::prelude::*;
use serde_json::Value;

/// A fresh database has no rows, so a page is empty and links nowhere; the limits
/// `openapi.yaml` publishes are refused, never clamped, outside their range.
#[tokio::test]
async fn lists_come_in_cursor_pages() {
    request::<App, _, _>(|request, _ctx| async move {
        let page = request.get("/api/neurodiversity_adjustment_reviews?limit=1").await;
        page.assert_status_ok();
        assert!(page.maybe_header("x-total-count").is_none());
        assert!(page.maybe_header("link").is_none());
        let rows: Vec<Value> = page.json();
        assert!(rows.is_empty());

        for refused in [
            "/api/neurodiversity_adjustment_reviews?cursor=forged",
            "/api/neurodiversity_adjustment_reviews?limit=0",
            "/api/neurodiversity_adjustment_reviews?limit=1001",
            "/api/neurodiversity_adjustment_reviews?limit=many",
        ] {
            request.get(refused).await.assert_status_unprocessable_entity();
        }
    })
    .await;
}
