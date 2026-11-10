use axa_test::prelude::*;
use international_certificate_of_vaccination_or_prophylaxis::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_international_certificate_of_vaccination_or_prophylaxes() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request
            .get("/api/international_certificate_of_vaccination_or_prophylaxes")
            .await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
