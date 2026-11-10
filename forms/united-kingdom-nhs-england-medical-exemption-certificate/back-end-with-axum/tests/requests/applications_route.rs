use axa_test::prelude::*;
use serial_test::serial;
use united_kingdom_nhs_england_medical_exemption_certificate::app::App;

#[tokio::test]
#[serial]
async fn can_get_applications() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/applications").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
