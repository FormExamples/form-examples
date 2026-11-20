use axa_test::prelude::*;
use united_kingdom_last_will_and_testament::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_united_kingdom_last_will_and_testament_grade_flags() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/united-kingdom-last-will-and-testament/united_kingdom_last_will_and_testament_grade_flags").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
