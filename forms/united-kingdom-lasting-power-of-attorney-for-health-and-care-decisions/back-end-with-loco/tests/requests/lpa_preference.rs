use united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_lpa_preferences() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/lpa_preferences").await;
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
