use allergy_assessment::app::App;
use axa::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_assessment_anaphylaxis_episodes() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/assessment_anaphylaxis_episodes").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
