use axa_test::prelude::*;
use united_kingdom_vehicle_registration_application::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_united_kingdom_vehicle_registration_applications() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/united-kingdom-vehicle-registration-application/united_kingdom_vehicle_registration_applications").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
