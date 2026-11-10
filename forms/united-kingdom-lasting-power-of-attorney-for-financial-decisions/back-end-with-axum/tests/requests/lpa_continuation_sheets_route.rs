use axa_test::prelude::*;
use serial_test::serial;
use united_kingdom_lasting_power_of_attorney_for_financial_decisions::app::App;

#[tokio::test]
#[serial]
async fn can_get_lpa_continuation_sheets() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/lpa_continuation_sheets").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
