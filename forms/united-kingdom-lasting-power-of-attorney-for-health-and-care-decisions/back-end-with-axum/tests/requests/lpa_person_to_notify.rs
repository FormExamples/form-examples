#[allow(unused_imports)]
use crate::{db, seed};
use axa_test::prelude::*;
use serial_test::serial;
use united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions::app::App;

#[tokio::test]
#[serial]
async fn can_get_lpa_person_to_notifies() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/lpa_person_to_notifies").await;
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
