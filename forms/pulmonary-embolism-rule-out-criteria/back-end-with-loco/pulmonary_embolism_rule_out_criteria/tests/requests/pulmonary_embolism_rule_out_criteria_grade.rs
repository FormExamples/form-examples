use pulmonary_embolism_rule_out_criteria::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_pulmonary_embolism_rule_out_criteria_grades() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/pulmonary_embolism_rule_out_criteria_grades/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
