use axa_test::prelude::*;
use genetic_assessment::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_assessment_cancer_history_items() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/assessment_cancer_history_items").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
