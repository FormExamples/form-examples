use axa_test::prelude::*;
use united_kingdom_birth_registration::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_united_kingdom_birth_registration_grades() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/united_kingdom_birth_registration_grades").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
