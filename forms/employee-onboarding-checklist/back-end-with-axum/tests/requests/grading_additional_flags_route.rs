use axa_test::prelude::*;
use employee_onboarding_checklist::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_grading_additional_flags() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/employee-onboarding-checklist/grading_additional_flags").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
