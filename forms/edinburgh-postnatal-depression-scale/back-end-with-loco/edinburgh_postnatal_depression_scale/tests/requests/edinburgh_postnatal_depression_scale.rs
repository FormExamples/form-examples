use edinburgh_postnatal_depression_scale::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_edinburgh_postnatal_depression_scales() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/edinburgh_postnatal_depression_scales/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
