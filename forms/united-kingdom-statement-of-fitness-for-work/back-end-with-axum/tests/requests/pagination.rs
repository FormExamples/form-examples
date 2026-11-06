use axa::testing::prelude::*;
use serial_test::serial;
use united_kingdom_statement_of_fitness_for_work::app::App;

/// The limits `openapi.yaml` publishes for every list.
#[tokio::test]
#[serial]
async fn lists_come_in_pages() {
    request::<App, _, _>(|request, _ctx| async move {
        let page = request.get("/api/clinicians").await;
        assert_eq!(page.header("x-limit"), "100");
        assert_eq!(page.header("x-offset"), "0");

        let page = request.get("/api/clinicians?limit=5000").await;
        assert_eq!(page.header("x-limit"), "1000");

        let page = request.get("/api/clinicians?offset=100001").await;
        page.assert_status_bad_request();
    })
    .await;
}
