use arc42::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_stakeholders() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/stakeholders/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
