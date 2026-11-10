use axa_test::prelude::*;
use orthopedic_assessment::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_assessment_rom_measurements() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/assessment_rom_measurements").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
