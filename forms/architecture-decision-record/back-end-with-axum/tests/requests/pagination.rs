//! Lists come in signed cursor pages, with no total.

use architecture_decision_record::app::App;
use axa_test::prelude::*;
use serde_json::Value;
use serial_test::serial;

/// A fresh database has no rows, so a page is empty and links nowhere; the limits
/// `openapi.yaml` publishes are refused, never clamped, outside their range.
#[tokio::test]
#[serial]
async fn lists_come_in_cursor_pages() {
    request::<App, _, _>(|request, _ctx| async move {
        let page = request.get("/api/architecture-decision-record/adrs?limit=1").await;
        page.assert_status_ok();
        assert!(page.maybe_header("x-total-count").is_none());
        assert!(page.maybe_header("link").is_none());
        let rows: Vec<Value> = page.json();
        assert!(rows.is_empty());

        for refused in [
            "/api/architecture-decision-record/adrs?cursor=forged",
            "/api/architecture-decision-record/adrs?limit=0",
            "/api/architecture-decision-record/adrs?limit=1001",
            "/api/architecture-decision-record/adrs?limit=many",
        ] {
            request.get(refused).await.assert_status_unprocessable_entity();
        }
    })
    .await;
}
