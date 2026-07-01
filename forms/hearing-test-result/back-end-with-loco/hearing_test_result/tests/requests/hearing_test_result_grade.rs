use hearing_test_result::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_hearing_test_result_grades() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/hearing_test_result_grades/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
