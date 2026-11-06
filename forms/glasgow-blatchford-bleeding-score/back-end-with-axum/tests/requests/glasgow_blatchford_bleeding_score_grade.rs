#[allow(unused_imports)]
use crate::{db, seed};
use axa::testing::prelude::*;
use glasgow_blatchford_bleeding_score::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_glasgow_blatchford_bleeding_score_grades() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request
            .get("/api/glasgow_blatchford_bleeding_score_grades")
            .await;
        assert_eq!(res.status_code(), 200);
        // Assert the JSON list handler answered.
        let content_type = res
            .headers()
            .get("content-type")
            .and_then(|v| v.to_str().ok())
            .unwrap_or("");
        assert!(
            content_type.contains("json"),
            "expected JSON from the list handler, got content-type {content_type:?}"
        );
    })
    .await;
}
