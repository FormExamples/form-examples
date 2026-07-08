use cardiac_stress_test_request::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_cardiac_stress_test_request_grade_rules() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/cardiac_stress_test_request_grade_rules/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
