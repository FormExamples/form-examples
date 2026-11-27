use axa_test::prelude::*;
use medical_renal_living_donor_request::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_donors() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/medical-renal-living-donor-request/donors").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
