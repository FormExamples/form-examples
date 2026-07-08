use medication_reconciliation::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_medication_reconciliation_information_sources() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/medication_reconciliation_information_sources/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
