use hypertension_review::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_hypertension_reviews() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/hypertension_reviews/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
