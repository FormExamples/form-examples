use united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_replacement_attorneys() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/replacement_attorneys/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
