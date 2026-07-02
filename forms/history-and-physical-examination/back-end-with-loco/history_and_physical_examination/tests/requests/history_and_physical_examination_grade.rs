use history_and_physical_examination::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_history_and_physical_examination_grades() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/history_and_physical_examination_grades/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
