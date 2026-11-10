//! Lists come in signed cursor pages, with no total.

use united_states_hipaa_authorization_form::app::App;
use axa_test::prelude::*;
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
            "INSERT INTO authorized_recipients SELECT (jsonb_populate_record(NULL::authorized_recipients, to_jsonb(t) || \
            jsonb_build_object('id', gen_random_uuid()))).* FROM authorized_recipients t",
        )
        .execute(&ctx.db)
        .await
        .unwrap();

        let first = request.get("/api/authorized_recipients?limit=1").await;
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
        assert!(next.starts_with("/api/authorized_recipients?limit=1&cursor="), "{next}");

        let second = request.get(&next).await;
        second.assert_status_ok();
        assert!(second.maybe_header("link").is_none());
        let second_rows: Vec<Value> = second.json();
        assert_eq!(second_rows.len(), 1);
        assert_ne!(first_rows[0]["id"], second_rows[0]["id"]);

        let carried = format!("{next}&status=other");
        for refused in [
            carried.as_str(),
            "/api/authorized_recipients?cursor=forged",
            "/api/authorized_recipients?limit=0",
            "/api/authorized_recipients?limit=1001",
            "/api/authorized_recipients?limit=many",
        ] {
            request.get(refused).await.assert_status_unprocessable_entity();
        }
    })
    .await;
}
