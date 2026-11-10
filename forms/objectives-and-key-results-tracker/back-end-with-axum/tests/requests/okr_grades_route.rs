use axa_test::prelude::*;
use objectives_and_key_results_tracker::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_okr_grades() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/okr_grades").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
