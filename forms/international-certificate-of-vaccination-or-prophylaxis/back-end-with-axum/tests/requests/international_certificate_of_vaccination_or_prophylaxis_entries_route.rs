use axa::testing::prelude::*;
use international_certificate_of_vaccination_or_prophylaxis::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_international_certificate_of_vaccination_or_prophylaxis_entries() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request
            .get("/api/international_certificate_of_vaccination_or_prophylaxis_entries")
            .await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
