use axa::testing::prelude::*;
use heart_health_check::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_body_measurements() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/body_measurements").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
