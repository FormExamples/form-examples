use axa_test::prelude::*;
use united_kingdom_birth_registration::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_united_kingdom_birth_registrations() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/united-kingdom-birth-registration/united_kingdom_birth_registrations").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
