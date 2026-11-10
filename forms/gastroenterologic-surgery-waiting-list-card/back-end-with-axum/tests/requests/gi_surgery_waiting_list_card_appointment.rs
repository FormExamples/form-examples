#[allow(unused_imports)]
use crate::{db, seed};
use axa_test::prelude::*;
use gastroenterologic_surgery_waiting_list_card::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_gi_surgery_waiting_list_card_appointments() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request
            .get("/api/gi_surgery_waiting_list_card_appointments")
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
