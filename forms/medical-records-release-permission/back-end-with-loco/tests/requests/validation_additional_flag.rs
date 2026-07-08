use medical_records_release_permission::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_validation_additional_flags() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/validation_additional_flags/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
