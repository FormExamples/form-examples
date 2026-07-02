use four_a_test_for_delirium::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_four_a_test_for_deliriums() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/four_a_test_for_deliriums/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
