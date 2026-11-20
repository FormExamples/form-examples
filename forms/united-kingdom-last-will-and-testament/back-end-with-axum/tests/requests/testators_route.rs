use axa_test::prelude::*;
use united_kingdom_last_will_and_testament::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_testators() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/testators").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
