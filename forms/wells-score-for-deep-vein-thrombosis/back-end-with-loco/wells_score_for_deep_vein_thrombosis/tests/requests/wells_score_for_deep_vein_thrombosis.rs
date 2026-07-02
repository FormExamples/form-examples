use wells_score_for_deep_vein_thrombosis::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_wells_score_for_deep_vein_thromboses() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/wells_score_for_deep_vein_thromboses/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
