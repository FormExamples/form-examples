use casualty_card_form::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_casualty_card_clinical_examinations() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/casualty_card_clinical_examinations/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
