use loco_rs::testing::prelude::*;
use serial_test::serial;
use uk_nhs_digital_technology_assessment_criteria::app::App;

#[tokio::test]
#[serial]
async fn can_get_assessors() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/assessors").await;
        assert_eq!(res.status_code(), 200);
        // Assert the JSON list handler answered, not Loco's HTML welcome page.
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
