use has_bled_score_for_major_bleeding_risk::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_has_bled_score_for_major_bleeding_risk_grades() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/has_bled_score_for_major_bleeding_risk_grades/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
