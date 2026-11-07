use axa::testing::prelude::*;
use predicting_risk_of_cardiovascular_disease_events::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_pvt_rules() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/pvt_rules").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
