//! Lists come in signed cursor pages, with no total.

use united_kingdom_statement_of_fitness_for_work::app::App;
use axa::testing::prelude::*;
use serde_json::Value;
use serial_test::serial;

/// This service seeds no rows, so a page is empty and links nowhere; the limits
/// `openapi.yaml` publishes are refused, never clamped, outside their range.
#[tokio::test]
#[serial]
async fn lists_come_in_cursor_pages() {
    request::<App, _, _>(|request, _ctx| async move {
        let page = request.get("/api/clinicians?limit=1").await;
        page.assert_status_ok();
        assert!(page.maybe_header("x-total-count").is_none());
        assert!(page.maybe_header("link").is_none());
        let rows: Vec<Value> = page.json();
        assert!(rows.is_empty());

        for refused in [
            "/api/clinicians?cursor=forged",
            "/api/clinicians?limit=0",
            "/api/clinicians?limit=1001",
            "/api/clinicians?limit=many",
        ] {
            request.get(refused).await.assert_status_unprocessable_entity();
        }
    })
    .await;
}
