use recommended_summary_plan_for_emergency_care_and_treatment::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_respect_grades() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/respect_grades/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
