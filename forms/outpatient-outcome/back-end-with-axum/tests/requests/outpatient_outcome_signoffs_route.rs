use axa_test::prelude::*;
use outpatient_outcome::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_outpatient_outcome_signoffs() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/outpatient_outcome_signoffs").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
