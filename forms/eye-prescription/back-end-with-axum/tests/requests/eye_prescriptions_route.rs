use axa_test::prelude::*;
use eye_prescription::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_eye_prescriptions() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/eye_prescriptions").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
