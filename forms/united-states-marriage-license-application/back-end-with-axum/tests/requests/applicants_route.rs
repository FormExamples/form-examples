use axa_test::prelude::*;
use united_states_marriage_license_application::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_applicants() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/applicants").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
