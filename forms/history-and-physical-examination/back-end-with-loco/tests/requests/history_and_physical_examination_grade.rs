use history_and_physical_examination::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_history_and_physical_examination_grades() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/history_and_physical_examination_grades").await;
        assert_eq!(res.status_code(), 200);
        // Assert the JSON list handler answered — not Loco's HTML welcome page,
        // which a trailing-slash URL falls through to (also returning 200).
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
