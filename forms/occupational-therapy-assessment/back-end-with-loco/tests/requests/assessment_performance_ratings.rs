use occupational_therapy_assessment::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_assessment_performance_ratings() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/assessment_performance_ratings/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
