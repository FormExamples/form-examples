use axa::testing::prelude::*;
use endocrinology_assessment::app::App;
use serde_json::Value;
use serial_test::serial;

/// The limits `openapi.yaml` publishes for every list.
#[tokio::test]
#[serial]
async fn lists_come_in_pages() {
    request::<App, _, _>(|request, ctx| async move {
        App::seed(&ctx).await.unwrap();

        let first = request.get("/api/assessments?limit=1").await;
        first.assert_status_ok();
        assert_eq!(first.header("x-total-count"), "1");
        let first: Vec<Value> = first.json();
        assert_eq!(first.len(), 1);

        let past: Vec<Value> = request
            .get("/api/assessments?limit=1&offset=1")
            .await
            .json();
        assert!(past.is_empty());

        let page = request.get("/api/assessments").await;
        assert_eq!(page.header("x-limit"), "100");
        assert_eq!(page.header("x-offset"), "0");

        let page = request.get("/api/assessments?limit=5000").await;
        assert_eq!(page.header("x-limit"), "1000");

        let page = request.get("/api/assessments?offset=100001").await;
        page.assert_status_bad_request();
    })
    .await;
}
