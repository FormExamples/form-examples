use axa_test::prelude::*;
use united_kingdom_divorce_application::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_united_kingdom_divorce_application_grade_rules() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/united_kingdom_divorce_application_grade_rules").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
