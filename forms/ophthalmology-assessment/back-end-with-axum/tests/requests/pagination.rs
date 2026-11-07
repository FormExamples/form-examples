//! Lists come in signed cursor pages, with no total.

use ophthalmology_assessment::app::App;
use axa::testing::prelude::*;
use serde_json::Value;
use serial_test::serial;

/// A page of one row links to the next, whose cursor works only where it was
/// made; the limits `openapi.yaml` publishes are refused, never clamped, outside
/// their range.
#[tokio::test]
#[serial]
async fn lists_come_in_cursor_pages() {
    request::<App, _, _>(|request, ctx| async move {
        App::seed(&ctx).await.unwrap();
        // A second live row, so that a page of one has a next page. Any unique
        // column of the copy is null, so it cannot clash.
        sqlx::query(
            "INSERT INTO assessment_current_medications SELECT (jsonb_populate_record(NULL::assessment_current_medications, to_jsonb(t) || \
            jsonb_build_object('id', gen_random_uuid()))).* FROM assessment_current_medications t",
        )
        .execute(&ctx.db)
        .await
        .unwrap();

        let first = request.get("/api/assessment_current_medications?limit=1").await;
        first.assert_status_ok();
        assert!(first.maybe_header("x-total-count").is_none());
        let first_rows: Vec<Value> = first.json();
        assert_eq!(first_rows.len(), 1);
        let link = first.header("link");
        let next = link
            .to_str()
            .unwrap()
            .strip_prefix('<')
            .and_then(|rest| rest.strip_suffix(">; rel=\"next\""))
            .unwrap()
            .to_string();
        assert!(next.starts_with("/api/assessment_current_medications?limit=1&cursor="), "{next}");

        let second = request.get(&next).await;
        second.assert_status_ok();
        assert!(second.maybe_header("link").is_none());
        let second_rows: Vec<Value> = second.json();
        assert_eq!(second_rows.len(), 1);
        assert_ne!(first_rows[0]["id"], second_rows[0]["id"]);

        let carried = format!("{next}&status=other");
        for refused in [
            carried.as_str(),
            "/api/assessment_current_medications?cursor=forged",
            "/api/assessment_current_medications?limit=0",
            "/api/assessment_current_medications?limit=1001",
            "/api/assessment_current_medications?limit=many",
        ] {
            request.get(refused).await.assert_status_unprocessable_entity();
        }
    })
    .await;
}
