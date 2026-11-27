use axa_test::prelude::*;
use medical_renal_transplant_recipient_request::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_medical_renal_transplant_recipient_request_grades() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/medical-renal-transplant-recipient-request/medical_renal_transplant_recipient_request_grades").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
