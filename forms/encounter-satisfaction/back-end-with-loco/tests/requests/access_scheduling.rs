use encounter_satisfaction::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_access_schedulings() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/access_schedulings/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
