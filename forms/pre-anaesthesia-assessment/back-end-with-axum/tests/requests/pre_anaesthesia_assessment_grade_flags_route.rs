use axa_test::prelude::*;
use pre_anaesthesia_assessment::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_pre_anaesthesia_assessment_grade_flags() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request
            .get("/api/pre_anaesthesia_assessment_grade_flags")
            .await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
