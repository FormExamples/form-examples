use axa::testing::prelude::*;
use serial_test::serial;
use united_kingdom_lasting_power_of_attorney_for_financial_decisions::app::App;

#[tokio::test]
#[serial]
async fn can_get_lasting_power_of_attorneys() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/lasting_power_of_attorneys").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
