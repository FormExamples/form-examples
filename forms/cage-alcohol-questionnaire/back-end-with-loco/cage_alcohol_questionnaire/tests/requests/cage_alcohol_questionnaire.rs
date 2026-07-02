use cage_alcohol_questionnaire::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_cage_alcohol_questionnaires() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/cage_alcohol_questionnaires/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
