use axa::testing::prelude::*;
use serial_test::serial;
use vaccinations_assessment::app::App;

#[tokio::test]
#[serial]
async fn can_get_additional_flags() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/additional_flags").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
