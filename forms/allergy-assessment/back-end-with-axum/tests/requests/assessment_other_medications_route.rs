use allergy_assessment::app::App;
use axa::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_assessment_other_medications() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/assessment_other_medications").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
