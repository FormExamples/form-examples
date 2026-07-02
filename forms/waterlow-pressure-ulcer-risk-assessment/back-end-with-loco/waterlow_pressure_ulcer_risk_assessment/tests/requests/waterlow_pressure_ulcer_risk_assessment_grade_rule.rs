use waterlow_pressure_ulcer_risk_assessment::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_waterlow_pressure_ulcer_risk_assessment_grade_rules() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/waterlow_pressure_ulcer_risk_assessment_grade_rules/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
