use nursing_care_plan::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_nursing_care_plans() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/nursing_care_plans/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
