use anion_gap_calculator::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_anion_gap_calculator_grades() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/anion_gap_calculator_grades/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
