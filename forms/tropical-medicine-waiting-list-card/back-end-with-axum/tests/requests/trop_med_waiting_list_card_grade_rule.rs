#[allow(unused_imports)]
use crate::{db, seed};
use axa_test::prelude::*;
use serial_test::serial;
use tropical_medicine_waiting_list_card::app::App;

#[tokio::test]
#[serial]
async fn can_get_trop_med_waiting_list_card_grade_rules() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request
            .get("/api/trop_med_waiting_list_card_grade_rules")
            .await;
        assert_eq!(res.status_code(), 200);
        // Assert the JSON list handler answered.
        let content_type = res
            .headers()
            .get("content-type")
            .and_then(|v| v.to_str().ok())
            .unwrap_or("");
        assert!(
            content_type.contains("json"),
            "expected JSON from the list handler, got content-type {content_type:?}"
        );
    })
    .await;
}
