#![forbid(unsafe_code)]

use axa::testing::prelude::*;
use neurodiversity_adjustment_request_axum_crate::app::App;

/// The limits `openapi.yaml` publishes for every list.
#[tokio::test]
async fn lists_come_in_pages() {
    request::<App, _, _>(|request, _ctx| async move {
        let page = request.get("/api/neurodiversity-adjustment-requests").await;
        page.assert_status_ok();
        assert_eq!(page.header("x-total-count"), "0");
        assert_eq!(page.header("x-limit"), "100");
        assert_eq!(page.header("x-offset"), "0");

        let page = request
            .get("/api/neurodiversity-adjustment-requests?limit=5000")
            .await;
        assert_eq!(page.header("x-limit"), "1000");

        let page = request
            .get("/api/neurodiversity-adjustment-requests?offset=100001")
            .await;
        page.assert_status_bad_request();
    })
    .await;
}
