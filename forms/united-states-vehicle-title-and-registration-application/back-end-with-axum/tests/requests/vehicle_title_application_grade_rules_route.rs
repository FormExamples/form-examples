use axa_test::prelude::*;
use united_states_vehicle_title_and_registration_application::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_vehicle_title_application_grade_rules() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/united-states-vehicle-title-and-registration-application/vehicle_title_application_grade_rules").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
