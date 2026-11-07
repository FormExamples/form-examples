use axa::testing::prelude::*;
use hematology_assessment::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_hem_rules() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/hem_rules").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
